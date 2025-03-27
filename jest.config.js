/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall memory_lab
 */

const config = {
  verbose: true,
  testRegex: '((.*/)?__tests__/.*)(\\.test|\\.spec)\\.(js|jsx)?$',
  maxConcurrency: 1,
  testEnvironment: 'node',
};

module.exports = config;
