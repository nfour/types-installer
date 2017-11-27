import * as commander from 'commander';
import * as actions from './actions';

commander
  .command('interactive')
  .action(actions.interactiveInstall);

commander
  .command('install [dependency]')
  .option('--selection <selection>', 'devDependencies, dependencies or all')
  .option('--toDev', 'Save all types to devDependencies')
  .action((dependency, options) => {
    return actions.install({ ...options, dependency });
  });

commander.parse(process.argv);

if (!commander.args.length) {
  // tslint:disable-next-line:no-floating-promises
  actions.interactiveInstall();
}
