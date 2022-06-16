/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ws_labs
 * @format
 */

import config from '../../lib/Config';
import {getCurrentNodeHeap} from '../../lib/NodeHeap';

beforeEach(() => {
  config.isTest = true;
});

const timeout = 5 * 60 * 1000;

test(
  'String heap object APIs work',
  async () => {
    class TestObject {
      public originalString = 'test';
      public concatedString = 'prefix_';
      public complexConcatString = 'prefix_';
    }
    const injected = new TestObject();
    injected.concatedString += 'suffix';
    injected.complexConcatString += 'value_';
    injected.complexConcatString += 123;
    injected.complexConcatString += '_suffix';

    const heap = await getCurrentNodeHeap();
    const testObject = heap.getAnyObjectWithClassName('TestObject');
    expect(testObject).not.toBe(null);

    // testObject.originalString === 'test'
    const originalString = testObject?.getReferenceNode('originalString');
    expect(originalString?.isString).toBe(true);
    expect(originalString?.toStringNode()?.stringValue).toBe('test');

    // testObject.concatedString === 'prefix_suffix';
    const concatString = testObject?.getReferenceNode('concatedString');
    expect(concatString?.type).toBe('concatenated string');
    expect(concatString?.isString).toBe(true);
    expect(concatString?.toStringNode()?.stringValue).toBe('prefix_suffix');

    // testObject.complexConcatString === 'prefix_value_123_suffix';
    const complexConcatString = testObject?.getReferenceNode(
      'complexConcatString',
    );
    expect(complexConcatString?.type).toBe('concatenated string');
    expect(complexConcatString?.isString).toBe(true);
    expect(complexConcatString?.toStringNode()?.stringValue).toBe(
      'prefix_value_123_suffix',
    );
  },
  timeout,
);
