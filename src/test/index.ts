import { Database } from '@db';
import Mocha from 'mocha';
import { log } from 'node:console';
import { argv, cwd, exit } from 'node:process';

export const isTest = argv[1].includes('mocha');

const mochaOpts = new Mocha({
  asyncOnly: true,
  color: true,
  retries: 1,
  slow: 20,
  timeout: 1000,
})
  .addFile('./src/test/create-user.test.ts')
  .cleanReferencesAfterRun(true);

/**
 * @param [boolean] se "false" - exiba apenas no console,
 *    se "true" ou vazio - salva em arquivo.
 * @returns Registra relatório em arquivo de acordo
 *    com as configurações do método 'reporter'.
 */
const logTestFile = (toFile: boolean = true): void => {
  if (!toFile) {
    return;
  }

  const reportDir: string = 'dist/test/results.tests.json';
  mochaOpts.reporter('json', { output: reportDir });

  log(`  Relatório de testes registrado em ${cwd()}\x1b[33;4m\\${reportDir.replace(/\//g, `\\`)}`, '\x1b[0m\n');
};

const filesForTesting = (): void =>
  log('\n', `Arquivos a analisar [${Array(mochaOpts.files).length}]: `, mochaOpts.files);

const tableName: string = 'user';

const cleanCloseDb = (): Promise<void> => {
  Database.connection.dropDatabase().catch((err: TypeError) => console.error('Error ==> ', err.message));
  return Database.connection.destroy();
};

const computedFailures = (fails: number): never => {
  console.log(
    '⎘  \x1b[4m',
    `All tests completed with${fails ? ` ${fails} failure${fails < 2 ? '' : 's'}` : 'out fail'}.`,
    '\x1b[0m  ⎗',
  );
  cleanCloseDb();
  process.exitCode = fails ? 1 : 0;
  exit();
};

export const clearRepository = async (): Promise<void> =>
  await Database.connection
    .getRepository(tableName)
    .clear()
    .catch((err: TypeError) => console.error({ [err.name]: err.message }));

export default { logTestFile, mochaOpts, filesForTesting, computedFailures };
