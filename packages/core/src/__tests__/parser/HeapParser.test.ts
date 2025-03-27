/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

import type {Nullable} from '../../lib/Types';
import config from '../../lib/Config';
import {takeNodeMinimalHeap} from '../../lib/NodeHeap';

beforeEach(() => {
  config.isTest = true;
});

const timeout = 5 * 60 * 1000;

test(
  'Capture inserted object',
  async () => {
    class TestObject {
      public arr1 = [1, 2, 3];
      public arr2 = ['1', '2', '3'];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const injected = new TestObject();
    const heap = await takeNodeMinimalHeap();
    expect(heap.hasObjectWithClassName('TestObject')).toBe(true);
  },
  timeout,
);

test(
  'Does not capture transient object',
  async () => {
    class TestObject {
      public arr1 = [1, 2, 3];
      public arr2 = ['1', '2', '3'];
    }
    let injected: Nullable<TestObject> = new TestObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    injected = null;

    const heap = await takeNodeMinimalHeap();
    expect(heap.hasObjectWithClassName('TestObject')).toBe(false);
  },
  timeout,
);
