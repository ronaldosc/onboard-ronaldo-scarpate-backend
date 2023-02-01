import 'reflect-metadata';
import { resolvers } from '@api';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { EnvConf, HOST, PORT } from '@core';
import { Database } from '@db';
import test, { isTest } from '@test';
import { GraphQLFormattedError } from 'graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { exit } from 'process';
EnvConf.cfg(isTest);

(async function () {
  const schema = await buildSchema({
    validate: false,
    resolvers,
    container: Container,
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: (error: GraphQLFormattedError) => {
      return error;
    },
  });

  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: Container.get(PORT), host: Container.get(HOST) },
  });
  await new Database().init();
  console.log(` 🚀  Servidor Apollo pronto em ${url} `);

  if (isTest) {
    const { logTestFile, mochaOpts, filesForTesting, computedFailures } = test;
    filesForTesting();
    logTestFile(false);
    mochaOpts.run((_fails) => computedFailures(_fails));
  }
})();
