import { ApolloServer } from "apollo-server";
import { context } from "./context";

import { schema } from "./schema";

export const server = new ApolloServer({
  schema,
  context,
});

const port = 4000;

server.listen({ port }).then(({ url }) => {
  console.log(`:> Server is ready at ${url}`);
});
