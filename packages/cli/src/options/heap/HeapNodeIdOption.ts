/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

import type {ParsedArgs} from 'minimist';
import type {MemLabConfig} from '@memlab/core';
import {BaseOption} from '@memlab/core';
import optionConstants from '../lib/OptionConstant';

export default class HeapNodeIdOption extends BaseOption {
  getOptionName(): string {
    return optionConstants.optionNames.NODE_ID;
  }

  getDescription(): string {
    return 'set heap node ID';
  }

  getExampleValues(): string[] {
    return ['94435', '@94435'];
  }

  async parse(config: MemLabConfig, args: ParsedArgs): Promise<void> {
    const optionName = this.getOptionName();
    const optionValue = args[optionName];
    if (optionValue) {
      if (typeof optionValue === 'string' && optionValue.startsWith('@')) {
        args[optionName] = optionValue.slice(1);
      }
      config.focusFiberNodeId = Number(args[optionName]);
    }
  }
}
