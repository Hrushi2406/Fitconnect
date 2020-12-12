import dotenv from "dotenv";
import DataLoader from "dataloader";

dotenv.config();

import { ApolloServer, gql, SchemaDirectiveVisitor } from "apollo-server";
import { resolvers } from "./interfaces/resolvers/resolver";
import AuthSchemaDirective from "./interfaces/schema_directives/auth_directive";
import { dependencies } from "./infrastructure/config/dependency_injector";
import { ITrainer } from "./domain/entities/trainer";
import { Plan } from "./domain/entities/plans";

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
    forPlan: Plan
    trainer: Trainer
    sub: Subscription
  }

  #Request type
  type Request {
    sender: User
    receiverId: String
    forPlan: Plan
    trainer: Trainer
  }

  #Subscription type
  type Subscription {
    price: String
    startDate: Date
    endDate: Date
  }

  # Friendship Type
  type Friendship {
    planId: String
    paid: [String]
  }

  # Payment type
  type MyPayment {
    forPlan: Plan
    trainer: Trainer
    partner: User
    friendship: Friendship
  }

  type Query {
    # Seed trainers to database
    seedTrainers: String
    # Seed users to database
    seedUsers: String
    # Returns user profile
    me: User @auth

    # trainer recommendations
    recommendations: [Trainer] @auth

    # Get Trainer Profile
    trainer(trainerId: String): Trainer

    # Returns my trainers current + Previous
    myTrainers: [MyTrainer] @auth

    # Return Pairing Request
    pairingRequests: [Request] @auth

    #Return my last payments
    myPayments: [MyPayment] @auth

    #Return list of trainers reported
    myReportedTrainers: [String] @auth 

    #Search and filter trainer
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

    #Search and filter User
    filterUsers(
      userLat: Float
      userLong: Float
      maxDistance: Int
      category: [String]
      gender: String
      age: Int
      sortBy: String
      order: String
    ): [User]
  }
  
  type Mutation {
    # Login User
    loginAsUser(email: String, password: String): String
    # Register User
    registerAsUser(
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

    # Send pairing request
    sendRequest(receiverId: String, planId: String): String @auth

    #Decline pairing request
    declineRequest(senderId: String, planId: String): String @auth

    # Accept pairing requests
    acceptRequest(senderId: String, planId: String): String @auth

    # Pay in pair
    payInPair(
      partnerId: String
      planId: String
      duration: String
      price: Int
    ): String @auth
    
    # Update permanent location
    updateUserLocation(
      lat: Float
      lon: Float
    ): String @auth

    reportTrainer(
      trainerId: String
    ): String @auth
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
