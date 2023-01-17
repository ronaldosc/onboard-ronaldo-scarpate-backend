import { buildSchema, graphql } from "graphql"

const schema = buildSchema(
  `
    type Query {
    hello: String
    }
  `
)

const initialGreetings = {
  hello: () => {
    return "Hello world!"
  }
}

graphql(
  {
    schema,

    source: "{ hello }",

    rootValue: initialGreetings
  }
).then(
  response => {
    console.log(response),
    console.table(response.data),
    console.table(response)
  }
)
