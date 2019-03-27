import * as Bluebird from 'bluebird';
import * as c from 'chalk';
import { shell } from 'execa';
import * as inquirer from 'inquirer';
import { join } from 'path';

// tslint:disable:no-console

export interface IDependencies { [key: string]: string; }
export interface ISelections { [key: string]: IDependencies; }

export function getDependencies (
  { selection = 'all', packageJson }: {
    selection?: string,
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

export interface IInstallTypesOptions {
  toDev?: boolean;
  selections?: any;
  pwd?: string;
  concurrency?: number;
  packageManager?: string;
}

/** @mything/banana becomes mything__banana */
const normalizeName = (name: string) =>
  /^@/.test(name)
    ? name.slice(1).split('/').join('__')
    : name;

export async function installTypes (
  dependencies: string[],
  { toDev = false, selections, pwd = '', concurrency = 1, packageManager }: IInstallTypesOptions,
) {
  packageManager = await getYarnVersion() ? 'yarn' : 'npm';

  const installCommand = (() => {
    if (packageManager === 'yarn') { return 'yarn add'; }
    return 'npm install --save';
  })();

  const directory = pwd ? `cd ${pwd} &&` : '';

  const installs = await Bluebird.map(dependencies, async (actualName) => {
    const typeKey = `@types/${normalizeName(actualName)}`;

    const saveTo = toDev || (actualName in selections.devDependencies) ? '--dev' : '';

    try {
      const { stdout } = await shell(`${directory} ${installCommand} ${saveTo} ${typeKey}`, {
        env: { ...process.env, FORCE_COLOR: true },
      });

      console.log(c.green(typeKey), 'found');
      console.log('\n', stdout, '\n');
    } catch (err) {
      console.log(c.yellow(typeKey), 'not found or failed to install');
      if (process.env.DEBUG) { console.error(c.red(err)); }
    }
  }, { concurrency });

  return installs;
}

export const install = async ({ selection = 'all', toDev = false, dependency = '' } = {}) => {
  if (dependency) {
    console.log(`Installing dependency ${c.cyan.bold(dependency || selection)} @types`);
  } else {
    console.log(`Installing ${c.cyan.bold(selection)} @types`);
  }

  const results = getDependencies({ selection });
  const { selections } = results;
  let { keys } = results;

  if (dependency) {
    keys = keys.filter((key) => key === dependency);
  }

  if (!keys.length) {
    console.error(c.yellow('No dependencies to install'));
    return;
  }

  await installTypes(keys, { toDev, selections });
};

export const interactiveInstall = async () => {
  const { selection, toDev } = await inquirer.prompt([
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

      choices: keys.map((key) => {
        const typeKey = `@types/${key}`;
        const isAlreadyTyped = typeKey in selections.all;

        return {
          name: `${key} ${isAlreadyTyped ? c.grey('(Installed)') : ''}`,
          value: key,
          checked: true,
        };
      }),
    },
  ]);

  await installTypes(selectedKeys, { toDev, selections });
};
