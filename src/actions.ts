import * as Bluebird from 'bluebird';
import * as c from 'chalk';
import { shell } from 'execa';
import * as inquirer from 'inquirer';
import { join } from 'path';

// tslint:disable:no-console

export interface IDependencies { [key: string]: string; }
export interface ISelections {
  dependencies: IDependencies;
  devDependencies: IDependencies;
  all: IDependencies;
}

export function getDependencies (
  { selection = 'all', packageJson }: {
    selection?: keyof ISelections,
    packageJson?: any,
  } = {}) {
  packageJson = packageJson || require(join(process.cwd(), 'package.json'));

  const selections: ISelections = {
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    all: {
      ...packageJson.devDependencies || {},
      ...packageJson.dependencies || {},
    },
  };

  const selected = selections[selection];

  const keys = Object.keys(selected)
    .filter((key) => !/^@types\//.test(key));

  return { keys, selected, selections };
}

async function getYarnVersion () {
  try {
    const result = await shell('yarn --version');
    return result.stdout;
  } catch (ex) {
    return '';
  }
}

export interface IInstallOptions {
  toDev?: boolean;
  selection?: keyof ISelections;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  deps?: string;
}

export interface IInstallTypesOptions extends IInstallOptions {
  selections: ISelections;
  pwd?: string;
  concurrency?: number;
}

/** @mything/banana becomes mything__banana */
const normalizeName = (name: string) =>
  /^@/.test(name)
    ? name.slice(1).split('/').join('__')
    : name;

const getTypeDepName = (name: string) => `@types/${normalizeName(name)}`;

export async function installTypes (
  dependencies: string[],
  { selections, toDev = false, pwd = '', concurrency = 1, packageManager }: IInstallTypesOptions,
) {

  const installCommand = await (async () => {
    if (packageManager === 'pnpm') { return 'pnpm install'; }

    packageManager = packageManager || (await getYarnVersion() ? 'yarn' : 'npm');

    if (packageManager === 'yarn') { return 'yarn add'; }

    return 'npm install';
  })();

  const directory = pwd ? `cd ${pwd} &&` : '';

  const installs = await Bluebird.map(dependencies, async (actualName) => {
    const typeDep = getTypeDepName(actualName);
    const saveTo = toDev || (actualName in selections.devDependencies) ? '--save-dev' : '';

    try {
      const { stdout } = await shell(`${directory} ${installCommand} ${saveTo} ${typeDep}`, {
        env: { ...process.env, FORCE_COLOR: true },
      });

      console.log(c.green(typeDep), 'found');
      console.log('\n', stdout, '\n');
    } catch (err) {
      console.log(c.yellow(typeDep), 'not found or failed to install');
      if (process.env.DEBUG) { console.error(c.red(err)); }
    }
  }, { concurrency });

  return installs;
}

export const install = async ({ selection = 'all', toDev = false, deps = '' }: IInstallOptions = {}) => {
  if (deps) {
    console.log(`Installing dependency ${c.cyan.bold(deps || selection)} in @types`);
  } else {
    console.log(`Installing ${c.cyan.bold(selection)} in @types`);
  }

  const results = getDependencies({ selection });
  const { selections } = results;
  let { keys } = results;

  if (deps) {
    keys = keys.filter((key) => key === deps);
  }

  if (!keys.length) {
    console.error(c.yellow('No dependencies to install'));
    return;
  }

  await installTypes(keys, { toDev, selections });
};

export const interactiveInstall = async () => {
  const { selection, toDev, packageManager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message: `Install options:`,
      default: 0,
      choices: [
        'all',
        'dependencies',
        'devDependencies',
      ],
    },
    {
      type: 'confirm',
      name: 'toDev',
      message: `Install all @types/* to ${c.cyan('devDependencies')}?`,
      default: false,
    },
    {
      type: 'list',
      name: 'packageManager',
      message: `Which package manager?:`,
      default: 'yarn',
      choices: ['yarn', 'npm', 'pnpm'] as Array<Required<IInstallOptions>['packageManager']>,
    },
  ]);

  const { keys, selections } = getDependencies({ selection });

  if (!keys.length) {
    console.error(c.yellow('No dependencies to install'));
    return;
  }

  console.log(`Installing ${c.cyan.bold(selection)} @type dependencies...`);
  console.log();

  const { selectedKeys } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedKeys',
      message: 'select',
      choices: keys.map((depName) => {
        const typeDep = getTypeDepName(depName);
        const isAlreadyTyped = typeDep in selections.all;

        return {
          name: `${depName} ${isAlreadyTyped ? c.grey(`(Installed: ${typeDep})`) : ''}`,
          value: depName,
          checked: true,
        };
      }),
    },
  ]);

  await installTypes(selectedKeys, { toDev, selections, packageManager });
};
