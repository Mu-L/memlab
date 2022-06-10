/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ws_labs
 * @format
 */

// initial page load's url
function url() {
  // Meta Headquarter
  return 'https://www.google.com/maps/@37.386427,-122.0428214,11z';
}

// action where we want to detect memory leaks
async function action(page) {
  await page.click('button[aria-label="Hotels"]');
}

// action where we want to go back to the step before
async function back(page) {
  await page.click('[aria-label="Clear search"]');
}

// specify the number of repeat for the action
function repeat() {
  return 5;
}

module.exports = {action, back, repeat, url};
