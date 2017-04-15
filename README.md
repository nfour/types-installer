[![npm version](https://badge.fury.io/js/types-installer.svg)](https://badge.fury.io/js/types-installer)
[![Build Status](https://travis-ci.org/nfour/types-installer.svg?branch=master)](https://travis-ci.org/nfour/types-installer)

# Types Installer

A CLI which updates and populates missing `@types/*` for your dependencies.

## Install
- **Globally**: `yarn global add types-installer`
  - Then run `types-installer`
- **Locally**: `yarn add types-installer`
  - Then run `yarn types-installer`

## CLI

#### Interactive

```bash
% types-installer

  ? Install options: all
  ? Install @types/* to devDependencies? Yes
  Installing all @type dependencies...
  ? select jest (Installed), ts-jest , ts-node , tslint , tslint-eslint-rules , typescript , chalk , commander (Installed), execa , inquirer

  @types/ts-jest not found or failed to install
  @types/tslint-eslint-rules not found or failed to install
  @types/ts-node not found or failed to install
  @types/execa not found or failed to install
  @types/tslint not found or failed to install
  @types/chalk found

  success Saved 1 new dependency.
  └─ @types/chalk@0.4.31

  @types/typescript not found or failed to install
  @types/commander not found or failed to install
  @types/jest found

  success Saved 1 new dependency.
  └─ @types/jest@19.2.2

  @types/inquirer found

  success Saved 1 new dependency.
  └─ @types/inquirer@0.0.32
```

#### Non-Interactive
```bash
% types-installer install

  Installing all @type dependencies...

  @types/ts-jest not found or failed to install
  @types/tslint-eslint-rules not found or failed to install
  @types/ts-node not found or failed to install
  @types/execa not found or failed to install
  @types/tslint not found or failed to install
  @types/chalk found

  success Saved 1 new dependency.
  └─ @types/chalk@0.4.31

  @types/typescript not found or failed to install
  @types/commander not found or failed to install
  @types/jest found

  success Saved 1 new dependency.
  └─ @types/jest@19.2.2

  @types/inquirer found

  success Saved 1 new dependency.
  └─ @types/inquirer@0.0.32
```

```bash
% types-installer-src install chalk

  Installing dependency chalk @types
  @types/chalk found

  success Saved 1 new dependency.
  └─ @types/chalk@0.4.31
```

#### Help

`types-installer --help` for more options


## Behavior

- Types are by default saved to `dependencies` or `devDependencies`, wherever the dependency exists.
- To force everything top be saved into `devDependencies`, add the `--toDev` flag.