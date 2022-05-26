/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * @format
 */
import type {CLIOptions} from '@memlab/core';

import cp from 'child_process';
import BaseCommand from '../../BaseCommand';
import {config, info} from '@memlab/core';

export default class CheckXvfbSupportCommand extends BaseCommand {
  getCommandName(): string {
    return 'check-xvfb';
  }

  getDescription(): string {
    return 'if Xvfb is installed on the machine, enable it';
  }

  isInternalCommand(): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(_options: CLIOptions): Promise<void> {
    try {
      const ret = cp.execSync('command -v xvfb-run').toString();
      if (ret) {
        config.machineSupportsXVFB = true;
      }
    } catch {
      // the env doesn't support XVFB, no need to do anything;
    }
    if (config.verbose) {
      info.lowLevel(`Xvfb supports: ${config.machineSupportsXVFB}`);
    }
  }
}
