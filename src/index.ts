import dotenv from "dotenv";

dotenv.config();

import { ApolloServer, gql } from "apollo-server";
import { resolvers } from "./interfaces/resolvers/resolver";
import { ITrainer } from "./domain/entities/trainer";



const typeDefs = gql`
  type Geometry {
    geometryId: String
    lat: Float
    lon: Float
    description: String
  }
  type Trainer {
    trainerId: String
    email: String
    name: String
    age: Int
    gender: String
    address: String
    bio: String
    category: String
    profession: String
    mobile: String
    fcRating: Int
    images: [String]
    minCost: Int
    geometry: Geometry
  }
  type Query {
    me: String
    searchTrainer(
      userLat: Float
      userLong: Float
      maxDistance: Int
      maxPrice: Int
      category: String
      minRating: Int
      gender: String
      age: Int
      sortBy: String
      order: String
      keyword: String
    ): [Trainer]
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
