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
import {E2EUtils} from '@memlab/e2e';

export default class ScenarioFileOption extends BaseOption {
  getOptionName(): string {
    return 'scenario';
  }

  getDescription(): string {
    return 'set file path loading test scenario';
  }

  getExampleValues(): string[] {
    return ['/tmp/scenario.js'];
  }

  async parse(config: MemLabConfig, args: ParsedArgs): Promise<void> {
    if (args.scenario) {
      const scenarioFile = args.scenario as string;
      // load scenario file and get target app name
      config.scenario = utils.loadScenario(scenarioFile);
      config.targetApp = E2EUtils.getScenarioAppName(config.scenario);
    }
  }
}
