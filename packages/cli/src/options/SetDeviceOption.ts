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
import {BaseOption, constant} from '@memlab/core';

const devices = constant.isFRL
  ? {}
  : constant.isFB
  ? require('puppeteer-core/DeviceDescriptors')
  : // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('puppeteer').devices;

export default class SetDeviceOption extends BaseOption {
  getOptionName(): string {
    return 'device';
  }

  getDescription(): string {
    return 'set the device type to emulate';
  }

  getExampleValues(): string[] {
    return Object.keys(devices);
  }

  async parse(config: MemLabConfig, args: ParsedArgs): Promise<void> {
    if (args.device) {
      config.setDevice(args.device, {manualOverride: true});
    }
  }
}
