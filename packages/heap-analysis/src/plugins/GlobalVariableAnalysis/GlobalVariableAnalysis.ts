/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ws_labs
 * @format
 */

import type {IHeapEdge, IHeapNode, IHeapSnapshot} from '@memlab/core';
import type {HeapAnalysisOptions} from '../../PluginUtils';

import {BaseOption} from '@memlab/core';
import SnapshotFileOption from '../../options/HeapAnalysisSnapshotFileOption';
import BaseAnalysis from '../../BaseAnalysis';
import pluginUtils from '../../PluginUtils';
import windowBuiltInVars from './BuiltInGlobalVariables';

class GlobalVariableAnalysis extends BaseAnalysis {
  getCommandName(): string {
    return 'global-variable';
  }

  getDescription(): string {
    return 'Get global variables in heap';
  }

  getOptions(): BaseOption[] {
    return [new SnapshotFileOption()];
  }

  async process(options: HeapAnalysisOptions): Promise<void> {
    const snapshot = await pluginUtils.loadHeapSnapshot(options);
    const list = this.getGlobalVariables(snapshot);
    pluginUtils.printReferencesInTerminal(list);
  }

  private shouldFilterOutEdge(edge: IHeapEdge): boolean {
    if (windowBuiltInVars.has(`${edge.name_or_index}`)) {
      return true;
    }
    const toNodeType = edge.toNode.type;
    if (edge.name_or_index === '<symbol>') {
      return true;
    }
    if (
      toNodeType === 'hidden' ||
      toNodeType === 'array' ||
      toNodeType === 'number'
    ) {
      return true;
    }
    return false;
  }

  private getGlobalVariables(snapshot: IHeapSnapshot): IHeapEdge[] {
    // rank heap objects based on fanout
    const ret: IHeapEdge[] = [];
    const processNode = (node: IHeapNode) => {
      if (!node.name.startsWith('Window ')) {
        return;
      }
      const refs = node.references;
      for (const edge of refs) {
        if (!this.shouldFilterOutEdge(edge)) {
          ret.push(edge);
        }
      }
    };
    snapshot.nodes.forEach(processNode);

    return ret.sort(
      (e1, e2) => e2.toNode.retainedSize - e1.toNode.retainedSize,
    );
  }
}

export default GlobalVariableAnalysis;
