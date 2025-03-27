/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

import type {IClusterStrategy, LeakTrace, TraceDiff} from '../../lib/Types';
import ClusterUtils from '../ClusterUtils';

// each trace is a cluster
export default class TraceAsClusterStrategy implements IClusterStrategy {
  public diffTraces(
    newTraces: LeakTrace[],
    existingTraces: LeakTrace[],
  ): TraceDiff {
    // duplicated cluster to remove
    const staleClusters: LeakTrace[] = [];
    // new cluster to save
    const clustersToAdd: LeakTrace[] = [];
    // all clusters, with duplicated cluters in the same sub-array
    const clusters: LeakTrace[][] = existingTraces.map(trace => [trace]);

    // checking new clusters
    for (let i = 0; i < newTraces.length; ++i) {
      const traceToCheck = newTraces[i];
      clustersToAdd.push(traceToCheck);
      clusters.push([traceToCheck]);
    }

    return {staleClusters, clustersToAdd, allClusters: clusters};
  }

  static isSimilarTrace(t1: LeakTrace, t2: LeakTrace): boolean {
    return ClusterUtils.isSimilarTrace(t1, t2);
  }
}
