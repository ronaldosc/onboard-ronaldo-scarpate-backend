import 'reflect-metadata';
import resolvers from '@api';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { EnvConf, HOST, PORT } from '@core';
import { Database } from '@db';
import test, { isTest } from '@test';
import { GraphQLFormattedError } from 'graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
EnvConf.cfg(isTest);

(async function () {
  const schema = await buildSchema({
    resolvers,
    container: Container,
    validate: false,
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
  await new Database().init(isTest);
  console.log(` 🚀  Servidor Apollo pronto em ${url} `);

  if (isTest) {
    const { logTestFile, mochaOpts, filesForTesting, computedFailures } = test;
    filesForTesting();
    logTestFile(false);
    mochaOpts.run((_fails) => computedFailures(_fails));
  }
})();
