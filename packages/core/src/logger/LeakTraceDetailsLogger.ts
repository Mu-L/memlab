/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

import type {
  IHeapSnapshot,
  ISerializedInfo,
  LeakTracePathItem,
  Nullable,
} from '../lib/Types';

import serializer from '../lib/Serializer';
import utils from '../lib/Utils';
import fs from 'fs';
import path from 'path';
import info from '../lib/Console';

class LeakTraceDetailsLogger {
  _wrapPathJSONInLoader(jsonContent: string): string {
    return `window.gcPath = ${jsonContent};`;
  }

  setTraceFileEmpty(filepath: string): void {
    const content = this._wrapPathJSONInLoader('');
    fs.writeFile(filepath, content, 'UTF-8', () => {
      // noop
    });
  }

  logTrace(
    leakedIdSet: Set<number>,
    snapshot: IHeapSnapshot,
    nodeIdsInSnapshots: Array<Set<number>>,
    trace: LeakTracePathItem,
    filepath: string,
  ): Nullable<ISerializedInfo> {
    const options = {leakedIdSet, nodeIdsInSnapshots};
    const gcTrace = serializer.JSONifyPath(trace, snapshot, options);
    try {
      const traceJSON = JSON.stringify(gcTrace, null, 2);
      const content = this._wrapPathJSONInLoader(traceJSON);
      fs.writeFile(filepath, content, 'UTF-8', () => {
        // noop
      });
    } catch (ex) {
      const error = utils.getError(ex);
      if (error.message.includes('Invalid string length')) {
        info.warning(
          'Trace details JSON not saved because it exceeded the size limit.',
        );
      } else {
        utils.haltOrThrow(error);
      }
    }
    return gcTrace;
  }

  logTraces(
    leakedIdSet: Set<number>,
    snapshot: IHeapSnapshot,
    nodeIdsInSnapshots: Array<Set<number>>,
    traces: LeakTracePathItem[],
    outDir: string,
  ): Array<ISerializedInfo> {
    const ret = [];
    for (const trace of traces) {
      const nodeId = utils.getLastNodeId(trace);
      const file = path.join(outDir, `@${nodeId}.json`);
      const jsonTrace = this.logTrace(
        leakedIdSet,
        snapshot,
        nodeIdsInSnapshots,
        trace,
        file,
      );
      if (jsonTrace != null) {
        ret.push(jsonTrace);
      }
    }
    return ret;
  }
}

export default new LeakTraceDetailsLogger();
