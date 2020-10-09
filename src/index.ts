import { ApolloServer, gql } from "apollo-server";
import { resolvers } from "./interfaces/resolvers/resolver";

const typeDefs = gql`
  type Query {
    login(email: String, password: String): String
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }: { url: string }) => console.log(`Server started on ${url}`));
