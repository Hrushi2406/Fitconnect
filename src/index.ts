import { ApolloServer, gql } from "apollo-server";
import { resolvers } from "./interfaces/resolvers/resolver";
import dotenv from "dotenv";

dotenv.config();

const typeDefs = gql`
  type Query {
    me: String
  }
  type Mutation {
    loginAsUser(email: String, password: String): String
    registerAsUser(email: String, password: String): String
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }: { url: string }) => console.log(`Server started on ${url}`));
