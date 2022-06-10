/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ws_labs
 * @format
 */

import type {ParsedArgs} from 'minimist';
import type {AnyRecord, MemLabConfig} from '@memlab/core';
import {BaseOption} from '@memlab/core';

export default class NumberOfRunsOption extends BaseOption {
  public static DEFAULT_NUM_RUNS = 10;
  getOptionName(): string {
    return 'run-num';
  }

  getDescription(): string {
    return 'set number of runs';
  }

  getExampleValues(): string[] {
    return ['5'];
  }

  async parse(config: MemLabConfig, args: ParsedArgs): Promise<AnyRecord> {
    const ret = Object.create(null);
    const name = this.getOptionName();
    ret.numOfRuns = args[name]
      ? args[name] | 0
      : NumberOfRunsOption.DEFAULT_NUM_RUNS;
    return ret;
  }
}
