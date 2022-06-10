/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ws_labs
 * @format
 */

import type {CommandOrder} from './Types';
import {constant, setInternalValue} from '@memlab/core';
import {CommandCategory} from '../../../BaseCommand';
import MemLabRunCommand from '../../MemLabRunCommand';
import ListScenariosCommand from '../../ListScenariosCommand';
import CheckLeakCommand from '../../heap/CheckLeakCommand';
import GetRetainerTraceCommand from '../../heap/GetRetainerTraceCommand';
import HeapAnalysisCommand from '../../heap/HeapAnalysisCommand';

const commandOrder: CommandOrder = [
  {
    category: CommandCategory.COMMON,
    commands: [
      new MemLabRunCommand(),
      new ListScenariosCommand(),
      new GetRetainerTraceCommand(),
      new CheckLeakCommand(),
      new HeapAnalysisCommand(),
    ],
  },
  {
    category: CommandCategory.DEV,
    commands: [],
  },
  {
    category: CommandCategory.MISC,
    commands: [],
  },
];

export default setInternalValue(commandOrder, __filename, constant.internalDir);
