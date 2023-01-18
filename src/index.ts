import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";

const pureServer = new ApolloServer({ typeDefs, resolvers });

(async function () {
  const { url } = await startStandaloneServer(pureServer, {
    listen: { port: 5000 },
  });
  console.log(` 🚀  Servidor Apollo pronto em ${url} `);
})();
