import Mocha, { MochaOptions } from 'mocha';
import { argv, cwd } from 'node:process';

/* export */ const isTest = argv[1].includes('mocha');

const reportDir = 'dist/test/results.tests.json';


let mochaInstance: Mocha = new Mocha().addFile('./src/test/create-user.test.ts').reporter("HTML", {})

const mochaOpts: MochaOptions = {
  color: true,
  timeout: 2000,
  retries: 1,
  asyncOnly: true,
  slow: 20,
  // as duas linhas abaixo configuram pra salvar em arquivo, e assim não exibem no console
  // reporter: 'json',
  // reporterOptions: {
  //   output: reportDir,
  // },
}
mochaInstance.options = mochaOpts
/* export */ const logTestFile = (toFile = true) => {
  mochaInstance.reporter('json', {output: reportDir})
  // Object.assign(mochaInstance.options, {
  //   reporter: 'json',
  //   reporterOption: {
  //     output: reportDir,
  //   },
  // })
  console.log(
    '\n',
    `Relatório de testes registrado em ${cwd()}\x1b[33;5m\\${reportDir.replace(/\//g, `\\`)}`,
    '\x1b[0m',
  )
  console.log(mochaInstance);;
};
/* export */ const mochaaa = mochaInstance


