import 'reflect-metadata';
import { resolvers } from '@api';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { EnvConf, HOST, PORT } from '@core';
import { Database } from '@db/dbconfig';
import { GraphQLFormattedError } from 'graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { isTest, logTestFile, mochaOpts } from '@test';
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
    logTestFile(true);
    mochaOpts.run();
  }
})();
