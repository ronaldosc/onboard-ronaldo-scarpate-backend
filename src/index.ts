import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { EnvConf, HOST, PORT } from '@core/env-conf';
import { dbConfig } from '@db/dbconfig';
import { Container } from 'typedi';
import { resolvers } from './resolver';
import { typeDefs } from './schema';

EnvConf.config();
const port: number = Container.get(PORT);
const host = Container.get(HOST);

const pureServer = new ApolloServer({ typeDefs, resolvers });

(async function () {
  const { url } = await startStandaloneServer(pureServer, {
    listen: { port: port, host: host },
  });

  await dbConfig();

  console.log(` 🚀  Servidor Apollo pronto em ${url} `);
})();
