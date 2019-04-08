[![NPM](https://img.shields.io/npm/v/types-installer.svg)](https://nodei.co/npm/types-installer/) &nbsp; [![Build Status](https://travis-ci.org/nfour/types-installer.svg?branch=master)](https://travis-ci.org/nfour/types-installer)

# Types Installer

A CLI which updates and populates missing `@types/*` for your dependencies.

## Install
```bash
yarn global add types-installer
# or
npm i -g types-installer
# then
types-installer
```

Or locally:
```bash
yarn add types-installer
# then
yarn types-installer

```



## CLI

```
  Usage: types-installer [options] [command]

  Commands:

  - interactive

  - install [options] [dependency]
      -s, --selection <selection>  devDependencies, dependencies or all
      -D, --toDev                  Save all types to devDependencies
      -p, --packageManager         Choose a package manager: npm, yarn or pnpm
```

#### Interactive

```bash
% types-installer

  ? Install options: all

  ? Install @types/* to devDependencies? Yes

  ? Which package manager? yarn

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

- `types-installer --help` for more options

## Behavior

- Types are by default saved to `dependencies` or `devDependencies`, wherever the dependency exists.
- To force everything top be saved into `devDependencies`, add the `--toDev` flag.
