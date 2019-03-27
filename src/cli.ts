import * as commander from 'commander';

import * as actions from './actions';

commander
  .command('interactive')
  .action(actions.interactiveInstall);

commander
  .command('install [dependency...]')
  .option('-s, --selection <selection>', 'devDependencies, dependencies or all')
  .option('-D, --toDev', 'Save all types to devDependencies')
  .option('-p, --packageManager', 'Choose a package manager: npm, yarn or pnpm')
  .action((deps, options) => {
    return actions.install({ ...options, deps });
  });

commander.parse(process.argv);

if (!commander.args.length) {
  // tslint:disable-next-line:no-floating-promises
  actions.interactiveInstall();
}
