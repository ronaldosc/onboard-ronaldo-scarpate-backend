import Mocha from 'mocha';
import { log } from 'node:console';
import { argv, cwd, exit } from 'node:process';

export const isTest = argv[1].includes('mocha');

const mochaOpts = new Mocha({
  asyncOnly: true,
  color: true,
  retries: 1,
  slow: 20,
  timeout: 2000,
}).addFile('./src/test/create-user.test.ts');

/**
 *
 * @param [boolean] se "false" - exiba apenas no console,
 *    se "true" ou vazio - salva em arquivo.
 * @returns Registra relatório em arquivo de acordo
 *    com as configurações do método 'reporter'.
 */
const logTestFile = (toFile: boolean = true) => {
  if (!toFile) {
    return;
  }

  const reportDir = 'dist/test/results.tests.json';
  mochaOpts.reporter('json', { output: reportDir });

  log(`  Relatório de testes registrado em ${cwd()}\x1b[33;4m\\${reportDir.replace(/\//g, `\\`)}`, '\x1b[0m\n');
};

const filesForTesting: Function = () =>
  log('\n', `Arquivos a analisar(${Array(mochaOpts.files).length}): `, mochaOpts.files);

const computedFailures: any = (fails: number) => {
  console.log(
    '⎘  \x1b[4m',
    `All tests completed with${fails ? ` ${fails} failure${fails < 2 ? '' : 's'}` : 'out fail'}.`,
    '\x1b[0m  ⎗',
  );
  process.exitCode = fails ? 1 : 0;
  return exit();
};

export default { logTestFile, mochaOpts, filesForTesting, computedFailures };
