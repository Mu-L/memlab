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
import type {MemLabConfig} from '@memlab/core';
import {BaseOption, utils} from '@memlab/core';

export default class LeakFilterFileOption extends BaseOption {
  getOptionName(): string {
    return 'leak-filter';
  }

  getDescription(): string {
    return 'specify a definition JS file for leak filter';
  }

  getExampleValues(): string[] {
    return ['/tmp/leak-filter.js'];
  }

  async parse(config: MemLabConfig, args: ParsedArgs): Promise<void> {
    if (args[this.getOptionName()]) {
      const file = args[this.getOptionName()];
      config.externalLeakFilter = utils.loadLeakFilter(file);
    }
  }
}
