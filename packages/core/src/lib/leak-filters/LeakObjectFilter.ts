/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

import type {MemLabConfig} from '../Config';
import type {HeapNodeIdSet, IHeapNode, IHeapSnapshot} from '../Types';
import {LeakDecision} from './BaseLeakFilter.rule';
import rules from './LeakFilterRuleList';

/**
 * apply the leak object filter rules chain and decide
 * if an object is a memory leak or not
 */
export class LeakObjectFilter {
  beforeFiltering(
    config: MemLabConfig,
    snapshot: IHeapSnapshot,
    leakedNodeIds: HeapNodeIdSet,
  ): void {
    for (const rule of rules) {
      rule.beforeFiltering(config, snapshot, leakedNodeIds);
    }
  }
  public filter(
    config: MemLabConfig,
    node: IHeapNode,
    snapshot: IHeapSnapshot,
    leakedNodeIds: HeapNodeIdSet,
  ): boolean {
    for (const rule of rules) {
      const decision = rule.filter(config, node, snapshot, leakedNodeIds);
      if (decision === LeakDecision.LEAK) {
        return true;
      }
      if (decision === LeakDecision.NOT_LEAK) {
        return false;
      }
    }
    return false;
  }
}
