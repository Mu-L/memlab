/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import path from 'path';
import modes from '../modes/RunningModes';
import info from './Console';
import constant from './Constant';
import fileManager from './FileManager';

import type {LaunchOptions, Permission} from 'puppeteer';
import type {
  AnyFunction,
  AnyValue,
  IRunningMode,
  IScenario,
  Nullable,
  Optional,
  QuickExperiment,
} from './Types';
import {setInternalValue} from './InternalValueSetter';

interface BrowserLaunchArgumentOptions {
  headless?: boolean;
  userDataDir?: string;
  devtools?: boolean;
  debuggingPort?: number;
  args?: string[];
}

interface BrowserConnectOptions {
  ignoreHTTPSErrors?: boolean;
  defaultViewport?: AnyValue | null;
  slowMo?: number;
  targetFilter?: AnyFunction;
}

interface Device {
  name: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    isLandscape: boolean;
  };
}

type ConfigOption = {
  workDir?: string;
};

const devices = constant.isFRL
  ? {}
  : constant.isFB
  ? require('puppeteer-core/DeviceDescriptors')
  : // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('puppeteer').devices;

// default viewport config for desktop
const windowWidth = 1680;
const windowHeight = 1080;
const defaultViewport = {
  width: windowWidth,
  height: windowHeight,
  deviceScaleFactor: 1,
};

export enum ErrorHandling {
  Halt = 1,
  Throw = 2,
}

export class MemLabConfig {
  snapshotHasDetachedness: boolean;
  specifiedEngine: boolean;
  verbose: boolean;
  jsEngine: string;
  _reportLeaksInTimers: boolean;
  _deviceManualOverridden: boolean;
  _timerNodes: string[];
  _timerEdges: string[];
  targetApp: string;
  targetTab: string;
  analysisMode: string;
  focusFiberNodeId: number;
  isFB: boolean;
  machineSupportsXVFB: boolean;
  useXVFB: boolean;

  browserDir: string;
  dataBaseDir: string;
  userDataDir: string;
  curDataDir: string;
  runMetaFile: string;
  snapshotSequenceFile: string;
  exploreResultFile: string;
  singleReportSummary: string;
  browserInfoSummary: string;
  unboundObjectCSV: string;
  viewJsonFile: string;
  reportBaseDir: string;
  reportDistDir: string;
  reportOutDir: string;
  previewReportDir: string;
  inputDataDir: string;
  persistentDataDir: string;
  consoleLogFile: string;
  cookieSettingFile: string;
  traceClusterFile: string;
  traceClusterOutDir: string;
  traceJsonOutDir: string;
  metricsOutDir: string;
  reportScreenshotFile: string;
  newUniqueClusterDir: string;
  staleUniqueClusterDir: string;
  currentUniqueClusterDir: string;
  allClusterSummaryFile: string;
  dataBuilderDataDir: string;
  unclassifiedClusterDir: string;
  externalCookiesFile: Optional<string>;

  puppeteerConfig: LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions;
  openDevtoolsConsole: boolean;
  emulateDevice: Nullable<Device>;
  _browser: string;
  addEnableGK: Set<string>;
  addDisableGK: Set<string>;
  qes: QuickExperiment[];
  isOndemand: boolean;
  useExternalSnapshot: boolean;
  externalRunMetaFile: string;
  externalSnapshotVisitOrderFile: string;
  externalSnapshotDir: Nullable<string>;
  externalSnapshotFilePaths: string[];
  runningMode: IRunningMode;
  dumpWebConsole: boolean;
  clearConsole: boolean;
  traverseDevToolsConsole: boolean;
  skipWarmup: boolean;
  skipSnapshot: boolean;
  skipScreenshot: boolean;
  skipScroll: boolean;
  skipExtraOps: boolean;
  skipGC: boolean;
  isContinuousTest: boolean;
  isTest: boolean;
  isLocalPuppeteer: boolean;
  isManualDebug: boolean;
  warmupRepeat: number;
  delayWhenNoPageLoadCheck: number;
  repeatIntermediateTabs: number;
  interactionFailRetry: number;
  initialLoadFailRetry: number;
  presenceCheckTimeout: number;
  delayBeforeExitUponException: number;
  windowWidth: number;
  windowHeight: number;
  disableScroll: boolean;
  scrollRepeat: number;
  extraWaitingForTarget: number;
  extraWaitingForFinal: number;
  defaultAfterClickDelay: number;
  warmupPageLoadTimeout: number;
  initialPageLoadTimeout: number;
  waitAfterGC: number;
  waitAfterPageLoad: number;
  waitAfterOperation: number;
  waitAfterScrolling: number;
  waitAfterTyping: number;
  stressTestRepeat: number;
  avoidLeakWithoutDetachedElements: boolean;
  hideBrowserLeak: boolean;
  chaseWeakMapEdge: boolean;
  detectFiberNodeLeak: boolean;
  grantedPermissions: Permission[];
  monotonicUnboundGrowthOnly: boolean;
  unboundSizeThreshold: number;
  resetGK: boolean;
  defaultUserAgent: Nullable<string>;
  dumpNodeInfo: boolean;
  maxSearchSteps: number;
  maxSearchReferences: number;
  nodeToShowMoreInfo: Set<string>;
  ignoreDevToolsConsoleLeak: boolean;
  ignoreInternalNode: boolean;
  nodeNameBlockList: Set<string>;
  edgeNameBlockList: Set<string>;
  nodeNameGreyList: Set<string>;
  edgeNameGreyList: Set<string>;
  localBrowserPort: number;
  ignoreTypesInContinuousTest: Set<string>;
  ignoreAppsInContinuousTest: Set<string>;
  URLParamLengthLimit: number;
  edgeIgnoreSetInShape: Set<string | number>;
  nodeIgnoreSetInShape: Set<string>;
  oversizeObjectAsLeak: boolean;
  oversizeThreshold: number;
  _isFullRun: boolean;
  scenarioFile: Nullable<string>;
  scenario?: Nullable<IScenario>;
  monoRepoDir: string;
  muteConsole: boolean;
  logUnclassifiedClusters: boolean;
  errorHandling: ErrorHandling;

  constructor(options: ConfigOption = {}) {
    // init properties, they can be configured manually
    this.init(options);
    // init built-in properties, they should not be configured manually
    this.initInternalConfigs();
  }

  private initInternalConfigs() {
    // DO NOT SET PARAMETER HERE
    this._reportLeaksInTimers = false;
    this._deviceManualOverridden = false;
    this._timerNodes = ['Pending activities'];
    this._timerEdges = [];
    this.targetApp = constant.unset;
    this.targetTab = constant.unset;
    this.analysisMode = constant.unset;
    this.focusFiberNodeId = 1;
    this.isFB = constant.isFB;
    // assuming the Evn doesn't support Xvfb before checking
    this.machineSupportsXVFB = false;
    // by default we want to use Xvfb if the Env supports it
    this.useXVFB = true;
    this.specifiedEngine = false;
    this.scenarioFile = null;

    // set puppeteer configuration
    this.puppeteerConfig = {
      devtools: this.openDevtoolsConsole,
      // IMPORTANT: test ContinuousTest before change this config
      ignoreHTTPSErrors: true,
      userDataDir: this.userDataDir,
      // Chromium in ContinuousTest needs this args
      args: [
        '--no-sandbox',
        // Disable popup notification
        '--disable-notifications',
        // Automatically allows media stream requests
        '--use-fake-ui-for-media-stream',
        // Feeds fake video stream
        '--use-fake-device-for-media-stream',
        // V8 GC move fewer objects around
        '--js-flags="--no-move-object-start"',
        // Alreay on by default, just want to make sure
        '--enable-precise-memory-info',
        'browser-test',
      ],
      defaultViewport,
    };
    // by default don't emulate any device, use the desktop config
    this.emulateDevice = null;
    // the default JS engine of snapshot
    this.jsEngine = constant.defaultEngine;
    // the default browser (Chromium)
    this._browser = 'chrome';
    // a set of additional GKs to be enabled
    this.addEnableGK = new Set();
    // a set of additional GKs to be disabled
    this.addDisableGK = new Set();
    // a list of additional QEs to be enabled
    this.qes = [];
    // check if running in ondemand devvm
    this.isOndemand = false;
    // configuration for analyzing external snapshots
    this.useExternalSnapshot = false;
    // new version of heap snapshot has a detachedness field
    this.snapshotHasDetachedness = false;
    // by default running in regular mode
    this.runningMode = modes.get('regular', this);
    // external heap snapshot paths, if enabled
    this.externalSnapshotFilePaths = [];
    // mute the console output, if enabled
    this.muteConsole = false;
    // log all leak traces, each as an unclassified cluster
    this.logUnclassifiedClusters = false;
    // by default halt the program when utils.haltOrThrow is calleds
    this.errorHandling = ErrorHandling.Halt;
  }

  // initialize configurable parameters
  private init(options: ConfigOption = {}): void {
    // if true dump extra debug info to terminal
    this.verbose = false;
    // dump the web console's output to terminal
    this.dumpWebConsole = false;
    // open dev-tools console when interacting with the page
    this.openDevtoolsConsole = false;
    // clear console, this may eliminate leaks retained by console
    this.clearConsole = false;
    // consider dev-tools console when search for leak trace
    this.traverseDevToolsConsole = true;
    // if true skip all warmup
    this.skipWarmup = false;
    // if true skip all snapshots
    this.skipSnapshot = false;
    // if true skip all screenshots
    this.skipScreenshot = false;
    // if true skip all scrolling
    this.skipScroll = false;
    // if true skip all extra operations on target and final
    this.skipExtraOps = false;
    // if true skip all GC
    this.skipGC = false;
    // true if running in ContinuousTest
    this.isContinuousTest = false;
    // true if running a local test
    this.isTest = false;
    // true if running in local puppeteer mode
    this.isLocalPuppeteer = false;
    // true if pausing on every step
    this.isManualDebug = false;
    // number of warmup repeat in each browser tab instance
    this.warmupRepeat = 2;

    // default waiting time when there is no page load checker callback
    this.delayWhenNoPageLoadCheck = 2000;
    // repeat the intermediate sequence
    this.repeatIntermediateTabs = 1;
    // the # of retries when interaction fails
    this.interactionFailRetry = 1;
    // the # of retries when initial load fails
    this.initialLoadFailRetry = 2;
    // timeout for checking the presence of non-optional click target
    this.presenceCheckTimeout = 120000;
    // default waiting time before exit when exception occurs during page interaction
    this.delayBeforeExitUponException = 120 * 1000;

    // Chrome window width
    this.windowWidth = windowWidth;
    // Chrome window height
    this.windowHeight = windowHeight;
    // disable all scroll
    this.disableScroll = false;
    // default number of scrolls on target page
    this.scrollRepeat = 5;
    // extra waiting time for the target page
    this.extraWaitingForTarget = 0;
    // extra waiting time for the final page
    this.extraWaitingForFinal = 0;
    // if a click operation does not setup a delay, use this delay after click
    this.defaultAfterClickDelay = 2000;
    // delay after garbage collection
    this.waitAfterGC = 1400;
    // delay after checking visual completion
    this.waitAfterPageLoad = 500;
    // delay after browser interaction
    this.waitAfterOperation = 200;
    // timeout for warmup page load (30 seconds)
    this.warmupPageLoadTimeout = 30 * 1000;
    // timeout for initial page load (10 minute)
    this.initialPageLoadTimeout = 10 * 60 * 1000;
    // extra delay after scrolling
    this.waitAfterScrolling = 5000;
    // extra delay after typing
    this.waitAfterTyping = 1000;
    // default repeat for stress testing
    this.stressTestRepeat = 5;

    // only show leaks with detached HTML elements
    this.avoidLeakWithoutDetachedElements = false;
    // if true, hide potential browser memory leak
    this.hideBrowserLeak = true;
    // recursively dump the key object of the WeakMap
    this.chaseWeakMapEdge = true;
    // consider outstanding Fiber nodes from target page as leaks
    this.detectFiberNodeLeak = true;
    // granted permissions to browser, so it won't ask by popping up dialog
    this.grantedPermissions = [
      'geolocation',
      'camera',
      'microphone',
      'accelerometer',
      'gyroscope',
      'magnetometer',
      'payment-handler',
      'background-sync',
    ];
    // unbounded growth check only reports objects that are monotonic increasing
    this.monotonicUnboundGrowthOnly = false;
    // object size below the threshold won't be reported
    this.unboundSizeThreshold = 10 * 1024;

    // if true reset the GK list in visit synthesizer
    this.resetGK = false;
    // default userAgent, if undefined use puppeteer's default value
    this.defaultUserAgent = constant.defaultUserAgent;
    // dump the heap node information in path summary (focuse mode)
    this.dumpNodeInfo = false;
    // the max steps when doing BFS search for shortest path
    this.maxSearchSteps = Infinity;
    // the max number of outgoing edges to be considered for a single node,
    // when doing BFS search for shortest path
    this.maxSearchReferences = Infinity;
    // the set of nodes to expand one more level in the HTML report
    this.nodeToShowMoreInfo = new Set();
    // if true ignore DevTools console leak
    this.ignoreDevToolsConsoleLeak = false;
    // if true ignore InternalNode when searching for leak trace
    this.ignoreInternalNode = false;
    // node names excluded from the trace finding
    this.nodeNameBlockList = new Set(['system / PropertyCell']);
    // edge names excluded from the trace finding
    this.edgeNameBlockList = new Set(['feedback_cell']);
    // node names less preferable in trace finding
    this.nodeNameGreyList = new Set([
      'InternalNode',
      'Pending activities',
      ...constant.V8SyntheticRoots,
    ]);
    // edge names less preferable in trace finding
    this.edgeNameGreyList = new Set(['alternate', 'firstEffect', 'lastEffect']);
    // browser port for debugging
    this.localBrowserPort = 57305;
    // skip running the following test types in ContinuousTest
    this.ignoreTypesInContinuousTest = new Set();
    // skip running the following apps in ContinuousTest
    this.ignoreAppsInContinuousTest = new Set();
    // a threshold hold to prevent exceeding refer header size limit
    this.URLParamLengthLimit = 400;

    // a set of ignored edges when clustering object shapes
    this.edgeIgnoreSetInShape = new Set(['__proto__', 'map']);
    // a set of ignored nodes when clustering object shapes
    this.nodeIgnoreSetInShape = new Set([
      '(closure)',
      '(array)',
      '(number)',
      '(system)',
      'system / Context',
      'system / Oddball',
    ]);
    // if true consider over sized objects as memory leak
    this.oversizeObjectAsLeak = false;
    // if larger than this threshold, consider as memory leak
    this.oversizeThreshold = 0;

    // initialize file and directory paths
    fileManager.initDirs(this, options);
  }

  getAdditionalConfigInContinuousTest(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _app: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _interaction: string,
  ): string[] {
    return [];
  }

  private static instance: MemLabConfig | null;
  // default config instance created from CLI
  public static getInstance(): MemLabConfig {
    if (!MemLabConfig.instance) {
      const config = new MemLabConfig();
      // do not consider objects kept alive by timers as leaks
      config.reportLeaksInTimers = true;
      // assign configuration to console manager
      info.setConfig(config);
      // set the singleton
      MemLabConfig.instance = config;
    }
    return MemLabConfig.instance;
  }

  public static resetConfigWithTranscientDir(): MemLabConfig {
    const config = MemLabConfig.getInstance();
    fileManager.initDirs(config, {transcient: true});
    return config;
  }

  private haltOrThrow(
    msg: string,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    secondaryPrintCallback: AnyFunction = () => {},
  ): void {
    if (this.errorHandling === ErrorHandling.Halt) {
      info.error(msg);
      secondaryPrintCallback();
      process.exit(1);
    } else {
      throw new Error(msg);
    }
  }

  setTarget(app: string, tab: string): void {
    this.targetApp = app;
    this.targetTab = tab;
  }

  set isFullRun(isFull: boolean) {
    this._isFullRun = isFull;
  }
  get isFullRun(): boolean {
    return this._isFullRun;
  }

  set browser(v: string) {
    if (!constant.supportedBrowsers[v]) {
      this.haltOrThrow(
        `Invalid browser: ${v} ` +
          `(supported browsers: ${Object.keys(constant.supportedBrowsers).join(
            ', ',
          )})`,
      );
    }
    this._browser = constant.supportedBrowsers[v];
    this.puppeteerConfig.executablePath = this.browserBinaryPath;
    if (this.verbose) {
      info.lowLevel(`set browser: ${this.puppeteerConfig.executablePath}`);
    }
  }

  get browser(): string {
    return this._browser || 'google-chrome';
  }

  get browserBinaryPath(): string {
    return path.join(this.browserDir, this.browser);
  }

  set reportLeaksInTimers(flag: boolean) {
    if (typeof flag !== 'boolean') {
      return;
    }
    if (flag) {
      this.removeFromSet(this.nodeNameBlockList, this._timerNodes);
      this.removeFromSet(this.edgeNameBlockList, this._timerEdges);
    } else {
      this.addToSet(this.nodeNameBlockList, this._timerNodes);
      this.addToSet(this.edgeNameBlockList, this._timerEdges);
    }
    this._reportLeaksInTimers = flag;
  }
  get reportLeaksInTimers(): boolean {
    return this._reportLeaksInTimers;
  }

  setDevice(
    deviceName: string,
    options: {manualOverride?: boolean} = {},
  ): void {
    if (!options.manualOverride && this._deviceManualOverridden) {
      return;
    }
    this._deviceManualOverridden = !!options.manualOverride;
    // set pc device
    if (deviceName == null || deviceName === 'pc') {
      this.emulateDevice = null;
      this.defaultUserAgent = constant.defaultUserAgent;
      this.puppeteerConfig.defaultViewport = defaultViewport;
      return;
    }
    // set mobile device
    const name = deviceName.split('-').join(' ');
    if (!devices[name]) {
      const supportedDevices = Array.from(Object.keys(devices))
        .filter(name => isNaN(parseInt(name, 10)))
        .map(name => name.split(' ').join('-'));
      this.haltOrThrow(`Invalid device: ${name}`, () => {
        info.lowLevel(`(supported devies: ${supportedDevices.join(', ')})`);
      });
    }
    this.emulateDevice = devices[name];
    this.puppeteerConfig.defaultViewport = null;
    this.defaultUserAgent = null;
  }

  private removeFromSet(set: Set<string>, list: string[]): void {
    for (const v of list) {
      set.delete(v);
    }
  }

  private addToSet(set: Set<string>, list: string[]): void {
    for (const v of list) {
      set.add(v);
    }
  }

  enableXvfb(display: string): void {
    this.useXVFB = true;
    this.puppeteerConfig.devtools = true;
    this.puppeteerConfig.args?.push(`--display=${display}`);
  }

  disableXvfb(): void {
    const args = [];
    for (const arg of this.puppeteerConfig.args || []) {
      if (!arg.startsWith('--display=')) {
        args.push(arg);
      }
    }
    this.puppeteerConfig.args = args;
    this.puppeteerConfig.devtools = false;
    this.useXVFB = false;
  }
}

const config = MemLabConfig.getInstance();
setInternalValue(config, __filename, constant.internalDir);
export default config;
