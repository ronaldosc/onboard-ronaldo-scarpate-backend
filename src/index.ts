import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { resolvers } from "./resolver"
import { typeDefs } from "./schema"

const pureServer = new ApolloServer({ typeDefs, resolvers })

;(async function () {
  return (await startStandaloneServer(pureServer)).url
})()

console.log(`🚀  Servidor Apollo pronto em http://localhost:4000`)
