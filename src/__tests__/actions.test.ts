import { writeFileSync } from 'fs';
import { join } from 'path';
import { getDependencies, installTypes } from "../actions";

describe('actions', () => {
  const pwd = join(__dirname, 'testProject');
  const actualPackagePath = join(pwd, 'package.json');
  let resolved: any;
  let expectedPackage: any;
  let samplePackage: any;

  beforeAll(() => {
    expectedPackage = require('./testProject/expected.package.json');
    samplePackage = require('./testProject/sample.package.json');

    writeFileSync(actualPackagePath, JSON.stringify(samplePackage));
  });

  it('resolved deps', () => {
    resolved = getDependencies({
      packageJson: require('./testProject/sample.package.json'),
    });

    expect(resolved.keys.sort()).toEqual(['chalk', 'jest'].sort());
  });

  it('installs types', async () => {
    await installTypes(resolved.keys, { selections: resolved.selections, pwd });

    const actualPackage = require(actualPackagePath);

    [
      [ actualPackage.dependencies, expectedPackage.dependencies ],
      [ actualPackage.devDependencies, expectedPackage.devDependencies ],
    ].forEach(([actual, expected]) => {
      expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());
    });
  });
});
