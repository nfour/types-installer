[![NPM](https://img.shields.io/npm/v/types-installer.svg)](https://nodei.co/npm/types-installer/) &nbsp; [![Build Status](https://travis-ci.org/nfour/types-installer.svg?branch=master)](https://travis-ci.org/nfour/types-installer)

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

  @types/tslint not found or failed to install
  @types/chalk found

  success Saved 1 new dependency.
  └─ @types/chalk@0.4.31
```

#### Non-Interactive
```bash
% types-installer install

  Installing all @type dependencies...

  @types/tslint not found or failed to install
  @types/chalk found

  success Saved 1 new dependency.
  └─ @types/chalk@0.4.31

```

```bash
% types-installer install chalk

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