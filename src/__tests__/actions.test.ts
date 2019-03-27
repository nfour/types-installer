import { writeFileSync } from 'fs';
import { join } from 'path';

import { getDependencies, installTypes } from '../actions';

describe('actions', () => {
  const pwd = join(__dirname, 'testProject');
  const actualPackagePath = join(pwd, 'package.json');
  let resolved: any;
  let expectedPackage: any;
  let samplePackage: any;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    expectedPackage = require('./testProject/expected.package.json');
    samplePackage = require('./testProject/sample.package.json');

    writeFileSync(actualPackagePath, JSON.stringify(samplePackage));

    // Make sure the actual package.json is reloaded for each test by removing it from the require() cache
    delete require.cache[require.resolve(actualPackagePath)];
  });

  it('resolved deps', () => {
    resolved = getDependencies({
      packageJson: require('./testProject/sample.package.json'),
    });

    expect(resolved.keys.sort()).toEqual(['@storybook/addons', 'chalk', 'jest'].sort());
  });

  it('installs types w/ yarn', async () => {
    await installTypes(resolved.keys, { selections: resolved.selections, pwd, packageManager: 'yarn' });

    const actualPackage = require(actualPackagePath);

    [
      [actualPackage.dependencies, expectedPackage.dependencies],
      [actualPackage.devDependencies, expectedPackage.devDependencies],
    ].forEach(([actual, expected]) => {
      expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());
    });
  });

  it('installs types w/ npm', async () => {
    await installTypes(resolved.keys, { selections: resolved.selections, pwd, packageManager: 'npm' });

    const actualPackage = require(actualPackagePath);

    [
      [actualPackage.dependencies, expectedPackage.dependencies],
      [actualPackage.devDependencies, expectedPackage.devDependencies],
    ].forEach(([actual, expected]) => {
      expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());
    });
  });

  it('installs types w/ auto-discovery', async () => {
    await installTypes(resolved.keys, { selections: resolved.selections, pwd });

    const actualPackage = require(actualPackagePath);

    [
      [actualPackage.dependencies, expectedPackage.dependencies],
      [actualPackage.devDependencies, expectedPackage.devDependencies],
    ].forEach(([actual, expected]) => {
      expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());
    });
  });
});
