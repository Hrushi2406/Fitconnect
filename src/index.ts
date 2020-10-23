import dotenv from "dotenv";

dotenv.config();

import { ApolloServer, gql } from "apollo-server";
import { resolvers } from "./interfaces/resolvers/resolver";
import { ITrainer } from "./domain/entities/trainer";
import auth from "./interfaces/middleware/auth";

const typeDefs = gql`
  scalar Date
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
    startPrice: Int
    lat: Float
    lon: Float
  }
  type User {
    userId: String
    name: String
    email: String
    password: String
    mobile: String
    age: Int
    gender: String
    bio: String
    address: String
    imageUrl: String
    lat: Float
    lon: Float
  }
  type Plan {
    planId: String
    title: String
    type: String
    price: Int
  }
  type Request {
    senderId: String
    receiverId: String
    planId: String
  }
  type Subscription {
    price: String
    startDate: Date
    endDate: Date
  }
  type Friendship {
    planId: String
    paid: [String]
  }
  type MyTrainer {
    plan: Plan
    trainer: Trainer
    sub: Subscription
  }
  type MyPayment {
    plan: Plan
    trainer: Trainer
    partner: User
    friendship: Friendship
  }
  type Query {
    me: String
    user: String
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
    getUserProfile(userId: String): User
    getTrainerProfile(trainerId: String): Trainer
    getTrainerPlans(trainerId: String): [Plan]
    getPairingRequests(userId: String): [Request]
    getTrainerbyPlanId(planId: String): Trainer
    getPlanbyId(planId: String): Plan
    getTrainerRecommendation(userId: String): [Trainer]
    getMyTrainers(userId: String): [MyTrainer]
    getMyPayments(userId: String): [MyPayment]
  }
  type Mutation {
    loginAsUser(email: String, password: String): String
    registerAsUser(
      userId: String
      name: String
      email: String
      password: String
      mobile: String
      age: Int
      gender: String
      bio: String
      address: String
      imageUrl: String
      lat: Float
      lon: Float
    ): String
    updateUserProfile(
      userId: String
      name: String
      email: String
      password: String
      mobile: String
      age: Int
      gender: String
      bio: String
      address: String
      imageUrl: String
    ): String
    sendPairingRequest(
      senderId: String
      receiverId: String
      planId: String
    ): String
    declineRequest(senderId: String, receiverId: String, planId: String): String
    acceptRequest(senderId: String, receiverId: String, planId: String): String
    subscribe(
      userId: String
      planId: String
      duration: String
      price: Int
    ): String
    payInPair(
      payeeId: String
      partnerId: String
      planId: String
      duration: String
      price: Int
    ): String
    addUserInterests(userId: String, interests: [String]): String
  }
`;

// seedTrainer();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = auth(req);
    return { user };
  },
});

server
  .listen()
  .then(({ url }: { url: string }) => console.log(`Server started on ${url}`));
