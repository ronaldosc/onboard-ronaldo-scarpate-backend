import { resolvers } from '@api';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { EnvConf, HOST, PORT } from '@core/env-conf';
import { dbConfig } from '@db/dbconfig';
import { GraphQLFormattedError } from 'graphql';
import { run } from 'mocha';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { configTestPaths } from './test';

const isTest = process.argv[1].includes('mocha');
EnvConf.config(isTest);
const port: number = Container.get(PORT);
const host = Container.get(HOST);

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
    listen: { port: port, host: host },
  });

  await dbConfig();

  console.log(` 🚀  Servidor Apollo pronto em ${url} `);

  if (isTest) {
    await configTestPaths();
    run();
  }
})();
