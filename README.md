[![Build Status](https://travis-ci.org/nfour/types-installer.svg?branch=master)](https://travis-ci.org/nfour/types-installer)

# Types Installer

A CLI which updates and populates missing `@types/*` for your dependencies.

## Install
Globally `yarn global add types-installer`
or locally `yarn add types-installer`

## CLI Interactive

#### Interactive
- Run `types-installer` and follow the prompts

```bash
[0] % types-installer
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
└─ @types/inquirer@0.0.32
```

#### Non-Interactive
- Run `types-installer install`

```bash
[0] % types-installer install
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
└─ @types/inquirer@0.0.32
```

- Run `types-installer install chalk`
```bash
[130] % types-installer-src install chalk
Installing dependency chalk @types
@types/chalk found
success Saved 1 new dependency.
└─ @types/chalk@0.4.31
```

#### Help

- Run `types-installer --help` for more options


## Behavior

Types are stored into either `dependencies` or `devDependencies` depending on whether the original dependency exists in either. \
To force everything top be saved into `devDependencies`, add the `--toDev` flag