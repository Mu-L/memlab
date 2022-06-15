---
sidebar_position: 1
---

# Introduction

## Why we built memlab?

One of the challenges in building a single page application (SPA) like Facebook.com is to monitor & detect memory leaks at scale. Specially considering amount of changes that go live continuously, we built memlab that automates memory leak detection.

## What is memlab?
`memlab` is a tool that lets you define your test `scenario` and help you detect a memory leak in your SPA.
The way `memlab` works is that it uses headless browser using the [scenario file](docs/api/scenario) to take a heap snapshot `baseline`,
do some interactions like navigating away or clicking buttons, and take another snapshot `target`.
Then, it compares the baseline against the target. This process repeats few more times.
If there is any memory leak in your SPA, then `memlab` will output and store them to your console and your local machine.

## What else memlab can do?
- Detecting memory leaks of heap snapshots taken from Node.js, Electron.js, and Hermes
- Built-in toolbox and APIs for finding memory optimization opportunities  - not necessarily memory leaks
- Advanced memory assertions

If you feel curious to test it out on your own,
- Head over to [Getting Started](/docs/getting-started) section for getting started.
- Want to learn more about [API](/docs/)?
