import dotenv from "dotenv";

dotenv.config();

import { ApolloServer, gql } from "apollo-server";
import { resolvers } from "./interfaces/resolvers/resolver";
import { seedTrainer } from "./infrastructure/config/seed_data";

const typeDefs = gql`
  type Query {
    me: String
  }
  type Mutation {
    loginAsUser(email: String, password: String): String
    registerAsUser(
      user_id: String
      name: String
      email: String
      password: String
    ): String
  }
`;

// seedTrainer();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }: { url: string }) => console.log(`Server started on ${url}`));
