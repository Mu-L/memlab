/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import BaseOperation from './BaseOperation';
import type {Page} from 'puppeteer';

class BackspaceOperation extends BaseOperation {
  kind: string;

  constructor() {
    super();
    this.kind = 'backspace';
  }

  async act(page: Page): Promise<void> {
    await page.keyboard.press('Backspace');
  }
}

export default BackspaceOperation;
