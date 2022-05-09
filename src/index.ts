import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { context } from "./context";

import { schema } from "./schema";

export const server = new ApolloServer({
  schema,
  context,
  introspection: true, // 1
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const port = process.env.PORT || 3000; // 3

server.listen({ port }).then(({ url }) => {
  console.log(`:> Server is ready at ${url}`);
});
