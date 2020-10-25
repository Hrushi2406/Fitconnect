import dotenv from "dotenv";
import DataLoader from "dataloader";

dotenv.config();

import { ApolloServer, gql, SchemaDirectiveVisitor } from "apollo-server";
import { resolvers } from "./interfaces/resolvers/resolver";
import { ITrainer } from "./domain/entities/trainer";
import AuthSchemaDirective from "./interfaces/schema_directives/auth_directive";
import { Plan } from "./domain/entities/plans";
import { dependencies } from "./infrastructure/config/dependency_injector";

const typeDefs = gql`
  # auth Directive
  directive @auth on FIELD_DEFINITION
  # data
  scalar Date

  # user type
  type User {
    userId: String
    name: String
    email: String
    mobile: String
    age: Int
    gender: String
    bio: String
    address: String
    imageUrl: String
    lat: Float
    lon: Float
  }

  # Trainer type
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
    plans: [Plan]
  }

  # Plan type
  type Plan {
    planId: String
    title: String
    type: String
    price: Int
  }

  # My Trainer type
  type MyTrainer {
    plan: Plan
    trainer: Trainer
    sub: Subscription
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
  type MyPayment {
    plan: Plan
    trainer: Trainer
    partner: User
    friendship: Friendship
  }
  type Query {
    # Seed trainers to database
    seedTrainers: String
    # Seed users to database
    seedUsers: String
    # Returns user profiusersle
    me: User @auth

    # trainer recommendations
    recommendations: [Trainer] @auth

    # Get Trainer Profile
    trainer(trainerId: String): Trainer

    # Returns my trainers current + Previous
    myTrainers: [Trainer] @auth

    searchTrainer(
      userLat: Float
      userLong: Float
      maxDistance: Int
      maxPrice: Int
      category: [String]
      minRating: Int
      gender: String
      age: Int
      sortBy: String
      order: String
      keyword: String
    ): [Trainer]
    getPairingRequests(userId: String): [Request]
    getTrainerbyPlanId(planId: String): Trainer
    getPlanbyId(planId: String): Plan
    getMyTrainers(userId: String): [MyTrainer]
    getMyPayments(userId: String): [MyPayment]
  }
  type Mutation {
    # Login User
    loginAsUser(email: String, password: String): String
    # Register User
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

    # Add users intrests
    addInterests(interests: [String]): String @auth

    # Subscribe to plan
    subscribe(planId: String, duration: String, price: Int): String @auth

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
    payInPair(
      payeeId: String
      partnerId: String
      planId: String
      duration: String
      price: Int
    ): String
  }
`;

const loader = {
  plans: new DataLoader(async (trainerIds: readonly string[]) => {
    const plans = await dependencies.trainerRepository.getAllPlansFromTrainerIds(
      trainerIds
    );

    return trainerIds.map((id: any) => plans.get(id));
  }),
};

// seedTrainer();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { headers: req.headers, loader };
  },
  schemaDirectives: {
    auth: AuthSchemaDirective,
  },
});

server
  .listen()
  .then(({ url }: { url: string }) => console.log(`Server started on ${url}`));
