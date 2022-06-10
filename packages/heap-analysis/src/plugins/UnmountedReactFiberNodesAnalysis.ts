/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ws_labs
 * @format
 */

import type {HeapAnalysisOptions} from '../PluginUtils';

import {utils, BaseOption} from '@memlab/core';
import SnapshotFileOption from '../options/HeapAnalysisSnapshotFileOption';
import BaseAnalysis from '../BaseAnalysis';
import pluginUtils from '../PluginUtils';

export default class UnmountedFiberNodeAnalysis extends BaseAnalysis {
  getCommandName(): string {
    return 'unmounted-fiber-node';
  }

  getDescription(): string {
    return 'Get unmounted React Fiber nodes';
  }

  getOptions(): BaseOption[] {
    return [new SnapshotFileOption()];
  }

  async process(options: HeapAnalysisOptions): Promise<void> {
    const snapshot = await pluginUtils.loadHeapSnapshot(options);
    const largeObjects = pluginUtils.filterOutLargestObjects(
      snapshot,
      utils.isDetachedFiberNode,
    );
    pluginUtils.printNodeListInTerminal(largeObjects);
  }
}
