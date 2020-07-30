# dOOv-TS

dOOv (Domain Object Oriented Validation) a fluent API for type-safe bean validation and mapping in TypeScript

[![npm version](https://img.shields.io/npm/v/doov.svg?style=flat&color=blue)](https://www.npmjs.com/package/doov)
[![Build Status](https://travis-ci.org/doov-org/doov-ts.svg?branch=master)](https://travis-ci.org/doov-org/doov-ts)
[![codecov](https://codecov.io/gh/doov-org/doov-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/doov-org/doov-ts)

## Local Development

### `yarn watch`

Runs the project in development/watch mode. Your project will be rebuilt upon changes, only in ES Module.

### `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

### `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `yarn prettier`

Runs the code formatter Prettier

## Continuous Integration

### Travis CI

Runs `yarn test-ci` which executes all tests, checks for code coverage, formatting errors and linting.

## Release

### `yarn version`

Set the new version according to the release with`--major` `--minor`, `--patch` or `--new -version`

### `yarn publish`

Publish to npm registry
