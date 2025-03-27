/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

import fs from 'fs';
import {DetachedDOMElementAnalysis, warmupAndTakeSnapshots} from '../../index';
import {scenario, testSetup, testTimeout} from './lib/E2ETestSettings';

beforeEach(testSetup);

function inject() {
  // @ts-ignore
  window.injectHookForLink4 = () => {
    // @ts-ignore
    window.__injectedValue = document.createElement('table');
  };
}

test(
  'Detached DOM analysis works as expected',
  async () => {
    const result = await warmupAndTakeSnapshots({
      scenario,
      evalInBrowserAfterInitLoad: inject,
    });
    // test analysis from auto loading
    let analysis = new DetachedDOMElementAnalysis();
    await analysis.run();
    let domElems = analysis.getDetachedElements();
    expect(
      domElems.some(node => node.name === 'Detached HTMLTableElement'),
    ).toBe(true);

    // test analysis from file
    const snapshotFile = result.getSnapshotFiles().pop() as string;
    analysis = new DetachedDOMElementAnalysis();
    const ret = await analysis.analyzeSnapshotFromFile(snapshotFile);

    // expect the heap analysis output log file to exist and
    // to contain the expected results
    expect(fs.existsSync(ret.analysisOutputFile)).toBe(true);
    expect(
      fs
        .readFileSync(ret.analysisOutputFile, 'UTF-8')
        .includes('Detached HTMLTableElement'),
    ).toBe(true);

    // check if the query result API works as expected
    domElems = analysis.getDetachedElements();
    expect(
      domElems.some(node => node.name === 'Detached HTMLTableElement'),
    ).toBe(true);
  },
  testTimeout,
);
