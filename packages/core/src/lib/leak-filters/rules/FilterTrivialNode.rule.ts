/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

import type {MemLabConfig} from '../../Config';
import type {IHeapNode} from '../../Types';
import {LeakDecision, LeakObjectFilterRuleBase} from '../BaseLeakFilter.rule';
import utils from '../../Utils';

/**
 * trivial nodes are not reported as memory leaks
 */
export class FilterTrivialNodeRule extends LeakObjectFilterRuleBase {
  filter(config: MemLabConfig, node: IHeapNode): LeakDecision {
    return this.isTrivialNode(node)
      ? LeakDecision.NOT_LEAK
      : LeakDecision.MAYBE_LEAK;
  }

  protected isTrivialNode(node: IHeapNode): boolean {
    return (
      node.type === 'number' ||
      utils.isStringNode(node) ||
      node.type === 'hidden'
    );
  }
}
