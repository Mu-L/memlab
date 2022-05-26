/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * @format
 */
import type {ParsedArgs} from 'minimist';

import fs from 'fs';
import {BaseOption, MemLabConfig, utils} from '@memlab/core';

export default class SnapshotDirectoryOption extends BaseOption {
  getOptionName(): string {
    return 'snapshot-dir';
  }

  getDescription(): string {
    return 'set directory path containing all heap snapshots under analysis';
  }

  getExampleValues(): string[] {
    return ['/tmp/snapshots/'];
  }

  async parse(config: MemLabConfig, args: ParsedArgs): Promise<void> {
    if (!args['snapshot-dir']) {
      return;
    }
    const dir = args['snapshot-dir'];
    if (!fs.existsSync(dir)) {
      utils.haltOrThrow(`Invalid directory: ${dir}`);
    }
    config.externalSnapshotDir = dir;
    config.useExternalSnapshot = true;
  }
}
