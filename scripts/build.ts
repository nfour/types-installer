import exec = require('execa');
import { chmod, copy, exists, lstatSync, mkdir, readdir, remove } from 'fs-extra';
import path = require('path');

new Promise<boolean>((resolve) => exists('./dist', resolve))
  .then((exists) => { if (exists) { return remove('./dist'); } })
  .then(() => { console.log('Creating dist'); return mkdir('dist'); })
  .then(() => { console.log('Building typescript'); return exec('tsc') as PromiseLike<void>; })
  .then(() => {
    console.log('Copying files to ./dist');
    return readdir('.')
      .then((files) => {
        return files
          .filter((file) => lstatSync(file).isFile())
          .reduce((chain, file) => chain.then(() => {
            const dest = path.join('./dist', path.relative('./', file));
            console.log(`\t${file} -> ${dest}`);
            return copy(file, dest);
          }), Promise.resolve());
      });
  })
  .then(() => {
    console.log('Cleaning up spurious files');
    const filesToRemove = [
      '__tests__',
      '.gitignore',
    ];
    return filesToRemove.reduce((chain, file) => chain.then(() => {
      const dest = path.join('./dist', file);
      console.log(`\tRemoving ${dest}`);
      return remove(dest);
    }), Promise.resolve());
  })
  .then(() => {
    const execBits = parseInt('111', 8);
    console.log('Making ./dist/bin/* executable');
    return readdir('./dist/bin').then((files) => {
      return files
        .map((name) => path.join('./dist/bin', name))
        .filter((file) => lstatSync(file).isFile())
        .reduce((chain, file) => chain.then(() => {
          const stat = lstatSync(file);
          console.log(`\tchmod +x ${file} :: `
            // tslint:disable-next-line:no-bitwise
            + `0${(stat.mode).toString(8)} -> 0${(stat.mode | execBits).toString(8)}`);
          // tslint:disable-next-line:no-bitwise
          return chmod(file, stat.mode | execBits);
        }), Promise.resolve());
    });
  });
