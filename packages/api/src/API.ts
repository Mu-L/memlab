/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

import type {Page, Browser} from 'puppeteer';
import type {ParsedArgs} from 'minimist';
import type {
  AnyFunction,
  ISerializedInfo,
  IScenario,
  XvfbType,
  Nullable,
  Optional,
} from '@memlab/core';
import {ConsoleMode} from './state/ConsoleModeManager';

import {
  analysis,
  info,
  utils,
  browserInfo,
  config as defaultConfig,
  MemLabConfig,
  fileManager,
} from '@memlab/core';
import {
  defaultTestPlanner,
  TestPlanner,
  Xvfb,
  E2EInteractionManager,
} from '@memlab/e2e';
import {BaseAnalysis} from '@memlab/heap-analysis';
import APIUtils from './lib/APIUtils';
import BrowserInteractionResultReader from './result-reader/BrowserInteractionResultReader';
import BaseResultReader from './result-reader/BaseResultReader';
import stateManager from './state/APIStateManager';

/**
 * Options for configuring browser interaction run, all fields are optional
 */
export type RunOptions = {
  /**
   * test scenario specifying how to interact with browser
   * (for more details view {@link IScenario})
   */
  scenario?: IScenario;
  /** the absolute path of cookies file */
  cookiesFile?: string;
  /**
   * function to be evaluated in browser context after
   * the web page initial load.
   * Note that this function is defined in node.js context but it will be
   * evaluated in browser context so the function should not use any closure
   * variables outside of the browser context.
   */
  evalInBrowserAfterInitLoad?: AnyFunction;
  /**
   * if true, take heap snapshot for each interaction step,
   * by default this is false, which means memlab will decide
   * which steps it will take heap snapshots
   */
  snapshotForEachStep?: boolean;
  /**
   * specify the working directory where you want memlab to dump
   * heap snapshots and other meta data of the test run. If no
   * working directory is provided, memlab will generate a random
   * temp directory under the operating system's default directory
   * for temporary files.
   * Note: It's the caller's responsibility to make sure the
   * specified working directory exists.
   */
  workDir?: string;
  /**
   * if this field is provided, it specifies the web worker as the target
   * for heap analysis. For example `{webWorker: null}` means analyzing
   * the heap of the first web worker found. `{webWorker: 'workerTitle'}`
   * means analyzing the heap of the web worker with name: `'workerTitle'`.
   */
  webWorker?: Optional<string>;
  /**
   * skip the initial page loading warmup for the web application being tested
   */
  skipWarmup?: boolean;
  /**
   * specifying the terminal output mode, default is `default`.
   * For more details. please check out {@link ConsoleMode}
   */
  consoleMode?: ConsoleMode;
  /**
   * if not specified, memlab will use the Chromium binary installed
   * by Puppeteer. Use this option to specify a different binary if
   * Puppeteer does not install the Chromium binary correctly (e.g., in a
   * environtment Docker) or when you may want to use a different version of
   * Chromium binary.
   */
  chromiumBinary?: string;
};

/**
 * A data structure holding the result of the {@link run} API call.
 */
export type RunResult = {
  /**
   * leak traces detected and clustered from the browser interaction
   */
  leaks: ISerializedInfo[];
  /**
   * a utility for reading browser interaction results from disk
   */
  runResult: BrowserInteractionResultReader;
};

/**
 * Options for memlab inter-package API calls
 * @internal
 */
export type APIOptions = {
  // NOTE: cannot pass in a different config instance
  //       before refactoring the codebase to not use the global config
  testPlanner?: TestPlanner;
  cache?: boolean;
  config?: MemLabConfig;
  evalInBrowserAfterInitLoad?: AnyFunction;
};

/**
 * This API warms up web server, runs E2E interaction, and takes heap snapshots.
 * This is equivalent to running `memlab warmup-and-snapshot` in CLI.
 * This is also equivalent to warm up and call {@link takeSnapshots}.
 *
 * @param options configure browser interaction run
 * @returns browser interaction results
 * * **Examples**:
 * ```javascript
 * const {warmupAndTakeSnapshots} = require('@memlab/api');
 *
 * (async function () {
 *   const scenario = {
 *     url: () => 'https://www.facebook.com',
 *   };
 *   const result = await warmupAndTakeSnapshots({scenario});
 * })();
 * ```
 */
export async function warmupAndTakeSnapshots(
  options: RunOptions = {},
): Promise<BrowserInteractionResultReader> {
  const config = getConfigFromRunOptions(options);
  const state = stateManager.getAndUpdateState(config, options);
  const testPlanner = new TestPlanner({config});
  const {evalInBrowserAfterInitLoad} = options;
  if (!options.skipWarmup) {
    await warmup({testPlanner, config, evalInBrowserAfterInitLoad});
  }
  await testInBrowser({testPlanner, config, evalInBrowserAfterInitLoad});
  const ret = BrowserInteractionResultReader.from(config.workDir);
  stateManager.restoreState(config, state);
  return ret;
}

/**
 * This API runs browser interaction and find memory leaks triggered in browser
 * This is equivalent to running `memlab run` in CLI.
 * This is also equivalent to warm up, and call {@link takeSnapshots}
 * and {@link findLeaks}.
 *
 * @param runOptions configure browser interaction run
 * @returns memory leaks detected and a utility reading browser
 * interaction results from disk
 * * **Examples**:
 * ```javascript
 * const {run} = require('@memlab/api');
 *
 * (async function () {
 *   const scenario = {
 *     url: () => 'https://www.facebook.com',
 *   };
 *   const {leaks} = await run({scenario});
 * })();
 * ```
 */
export async function run(options: RunOptions = {}): Promise<RunResult> {
  const config = getConfigFromRunOptions(options);
  const state = stateManager.getAndUpdateState(config, options);
  const testPlanner = new TestPlanner({config});
  const {evalInBrowserAfterInitLoad} = options;
  if (!options.skipWarmup) {
    await warmup({testPlanner, config, evalInBrowserAfterInitLoad});
  }
  await testInBrowser({testPlanner, config, evalInBrowserAfterInitLoad});
  const runResult = BrowserInteractionResultReader.from(config.workDir);
  const leaks = await findLeaks(runResult);
  stateManager.restoreState(config, state);
  return {leaks, runResult};
}

/**
 * This API runs E2E interaction and takes heap snapshots.
 * This is equivalent to running `memlab snapshot` in CLI.
 *
 * @param options configure browser interaction run
 * @returns a utility reading browser interaction results from disk
 * * **Examples**:
 * ```javascript
 * const {takeSnapshots} = require('@memlab/api');
 *
 * (async function () {
 *   const scenario = {
 *     url: () => 'https://www.facebook.com',
 *   };
 *   const result = await takeSnapshots({scenario});
 * })();
 * ```
 */
export async function takeSnapshots(
  options: RunOptions = {},
): Promise<BrowserInteractionResultReader> {
  const config = getConfigFromRunOptions(options);
  const state = stateManager.getAndUpdateState(config, options);
  const testPlanner = new TestPlanner();
  const {evalInBrowserAfterInitLoad} = options;
  await testInBrowser({testPlanner, config, evalInBrowserAfterInitLoad});
  const ret = BrowserInteractionResultReader.from(config.workDir);
  stateManager.restoreState(config, state);
  return ret;
}

/**
 * This API finds memory leaks by analyzing heap snapshot(s).
 * This is equivalent to `memlab find-leaks` in CLI.
 *
 * @param runResult return value of a browser interaction run
 * @param options configure memory leak detection run
 * @param options.consoleMode specify the terminal output
 * mode (see {@link ConsoleMode})
 * @returns leak traces detected and clustered from the browser interaction
 * * **Examples**:
 * ```javascript
 * const {findLeaks, takeSnapshots} = require('@memlab/api');
 *
 * (async function () {
 *   const scenario = {
 *     url: () => 'https://www.facebook.com',
 *   };
 *   const result = await takeSnapshots({scenario, consoleMode: 'SILENT'});
 *   const leaks = findLeaks(result, {consoleMode: 'CONTINUOUS_TEST'});
 * })();
 * ```
 */
export async function findLeaks(
  runResult: BaseResultReader,
  options: {consoleMode?: ConsoleMode} = {},
): Promise<ISerializedInfo[]> {
  const state = stateManager.getAndUpdateState(defaultConfig, options);
  const workDir = runResult.getRootDirectory();
  fileManager.initDirs(defaultConfig, {workDir});
  defaultConfig.chaseWeakMapEdge = false;
  const ret = await analysis.checkLeak();
  stateManager.restoreState(defaultConfig, state);
  return ret;
}

/**
 * This API finds memory leaks by analyzing specified heap snapshots.
 * This is equivalent to `memlab find-leaks` with
 * the `--baseline`, `--target`, and `--final` flags in CLI.
 *
 * @param baselineSnapshot the file path of the baseline heap snapshot
 * @param targetSnapshot the file path of the target heap snapshot
 * @param finalSnapshot the file path of the final heap snapshot
 * @param options optionally, you can specify a mode for heap analysis
 * @param options.workDir specify a working directory (other than
 * the default one)
 * @param options.consoleMode specify the terminal output
 * mode (see {@link ConsoleMode})
 * @returns leak traces detected and clustered from the browser interaction
 */
export async function findLeaksBySnapshotFilePaths(
  baselineSnapshot: string,
  targetSnapshot: string,
  finalSnapshot: string,
  options: {workDir?: string; consoleMode?: ConsoleMode} = {},
): Promise<ISerializedInfo[]> {
  const state = stateManager.getAndUpdateState(defaultConfig, options);
  defaultConfig.useExternalSnapshot = true;
  defaultConfig.externalSnapshotFilePaths = [
    baselineSnapshot,
    targetSnapshot,
    finalSnapshot,
  ];
  fileManager.initDirs(defaultConfig, {workDir: options.workDir});
  defaultConfig.chaseWeakMapEdge = false;
  const ret = await analysis.checkLeak();
  stateManager.restoreState(defaultConfig, state);
  return ret;
}

/**
 * This API analyzes heap snapshot(s) with a specified heap analysis.
 * This is equivalent to `memlab analyze` in CLI.
 *
 * @param runResult return value of a browser interaction run
 * @param heapAnalyzer instance of a heap analysis
 * @param args other CLI arguments that needs to be passed to the heap analysis
 * @returns each analysis may have a different return type, please check out
 * the type definition or the documentation for the `process` method of the
 * analysis class you are using for `heapAnalyzer`.
 * * **Examples**:
 * ```javascript
 * const {analyze, takeSnapshots, StringAnalysis} = require('@memlab/api');
 *
 * (async function () {
 *   const scenario = {
 *     url: () => 'https://www.facebook.com',
 *   };
 *   const result = await takeSnapshots({scenario});
 *   const analysis = new StringAnalysis();
 *   await analyze(result, analysis);
 * })();
 * ```
 */
export async function analyze(
  runResult: BaseResultReader,
  heapAnalyzer: BaseAnalysis,
  args: ParsedArgs = {_: []},
): Promise<void> {
  const workDir = runResult.getRootDirectory();
  fileManager.initDirs(defaultConfig, {workDir});
  return await heapAnalyzer.run({args});
}

/**
 * This warms up web server by sending web requests to the web sever.
 * This is equivalent to running `memlab warmup` in CLI.
 * @internal
 *
 * @param options configure browser interaction run
 */
export async function warmup(options: APIOptions = {}): Promise<void> {
  const config = options.config ?? defaultConfig;
  if (config.verbose) {
    info.lowLevel(`Xvfb: ${config.useXVFB}`);
  }
  const testPlanner = options.testPlanner ?? defaultTestPlanner;
  try {
    if (config.skipWarmup) {
      return;
    }
    const browser = await APIUtils.getBrowser({warmup: true});

    const visitPlan = testPlanner.getVisitPlan();
    config.setDevice(visitPlan.device);

    const numOfWarmup = visitPlan.numOfWarmup || 3;
    const promises = [];
    for (let i = 0; i < numOfWarmup; ++i) {
      promises.push(browser.newPage());
    }
    const pages = await Promise.all(promises);
    info.beginSection('warmup');
    await Promise.all(
      pages.map(async page => {
        await setupPage(page, {cache: false});
        const interactionManager = new E2EInteractionManager(page, browser);
        await interactionManager.warmupInPage();
      }),
    ).catch(err => {
      info.error(err.message);
    });
    info.endSection('warmup');

    await utils.closePuppeteer(browser, pages, {warmup: true});
  } catch (ex) {
    const error = utils.getError(ex);
    utils.checkUninstalledLibrary(error);
    throw ex;
  }
}

function getConfigFromRunOptions(options: RunOptions): MemLabConfig {
  let config = MemLabConfig.getInstance();
  if (options.workDir) {
    fileManager.initDirs(config, {workDir: options.workDir});
  } else {
    config = MemLabConfig.resetConfigWithTransientDir();
  }
  if ('webWorker' in options) {
    config.isAnalyzingMainThread = false;
    const value = options.webWorker;
    if (typeof value === 'string') {
      config.targetWorkerTitle = value;
    }
  } else {
    config.isAnalyzingMainThread = true;
  }
  config.isFullRun = !!options.snapshotForEachStep;
  return config;
}

async function setupPage(page: Page, options: APIOptions = {}): Promise<void> {
  const config = options.config ?? defaultConfig;
  const testPlanner = options.testPlanner ?? defaultTestPlanner;
  if (config.emulateDevice) {
    await page.emulate(config.emulateDevice);
  }

  if (config.defaultUserAgent && config.defaultUserAgent !== 'default') {
    await page.setUserAgent(config.defaultUserAgent);
  }

  // set login session
  await page.setCookie(...testPlanner.getCookies());
  const cache = options.cache ?? true;
  await page.setCacheEnabled(cache);

  // automatically accept dialog
  page.on('dialog', async dialog => {
    if (config.verbose) {
      info.lowLevel(`Browser dialog: ${dialog.message()}`);
    }
    await dialog.accept();
  });
}

async function initBrowserInfoInConfig(
  browser: Browser,
  options: APIOptions = {},
): Promise<void> {
  const config = options.config ?? defaultConfig;
  browserInfo.recordPuppeteerConfig(config.puppeteerConfig);
  const version = await browser.version();
  browserInfo.recordBrowserVersion(version);
  if (config.verbose) {
    info.lowLevel(JSON.stringify(browserInfo, null, 2));
  }
}

/**
 * Browser interaction API used by MemLab API and MemLab CLI
 * @internal
 */
export async function testInBrowser(options: APIOptions = {}): Promise<void> {
  const config = options.config ?? defaultConfig;
  if (config.verbose) {
    info.lowLevel(`Xvfb: ${config.useXVFB}`);
  }

  const testPlanner = options.testPlanner ?? defaultTestPlanner;
  let interactionManager: Nullable<E2EInteractionManager> = null;
  let xvfb: Nullable<XvfbType> = null;
  let browser: Nullable<Browser> = null;
  let page: Nullable<Page> = null;
  let maybeError: Nullable<Error> = null;
  try {
    xvfb = Xvfb.startIfEnabled();
    browser = await APIUtils.getBrowser();
    const pages = await browser.pages();
    page = pages.length > 0 ? pages[0] : await browser.newPage();
    // create and configure web page interaction manager
    interactionManager = new E2EInteractionManager(page, browser);
    if (options.evalInBrowserAfterInitLoad) {
      interactionManager.setEvalFuncAfterInitLoad(
        options.evalInBrowserAfterInitLoad,
      );
    }
    const visitPlan = testPlanner.getVisitPlan();
    // setup page configuration
    config.setDevice(visitPlan.device);
    await initBrowserInfoInConfig(browser);
    browserInfo.monitorWebConsole(page);
    await setupPage(page, options);
    // interact with the web page and take heap snapshots
    await interactionManager.visitAndGetSnapshots(options);
  } catch (ex) {
    maybeError = utils.getError(ex);
    utils.checkUninstalledLibrary(maybeError);
  } finally {
    if (browser && page) {
      await utils.closePuppeteer(browser, [page]);
    }
    if (interactionManager) {
      interactionManager.clearCDPSession();
    }
    if (xvfb) {
      xvfb.stop((err: Optional<Error>) => {
        if (err) {
          utils.haltOrThrow(err);
        }
      });
    }
    if (maybeError != null) {
      utils.haltOrThrow(maybeError);
    }
  }
}
