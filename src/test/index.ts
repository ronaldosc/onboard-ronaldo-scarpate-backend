import Mocha from 'mocha';
import { log } from 'node:console';
import { argv, cwd } from 'node:process';

const isTest = argv[1].includes('mocha');

const mochaOpts = new Mocha({
  asyncOnly: true,
  color: true,
  retries: 1,
  slow: 20,
  timeout: 2000,
}).addFile('./src/test/create-user.test.ts');

const logTestFile = (toFile: boolean = true) => {
  if (!toFile) {
    return;
  }

  const reportDir = 'dist/test/results.tests.json';
  mochaOpts.reporter('json', { output: reportDir })
  
  log('\n', `Relatório de testes registrado em ${cwd()}\x1b[33;5m\\${reportDir.replace(/\//g, `\\`)}`, '\x1b[0m');
};

const { files } = mochaOpts;
log(`Arquivos analisados(${Array(files).length}):  `, files, '\n');

export { isTest, logTestFile, mochaOpts };
