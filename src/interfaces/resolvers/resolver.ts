import { UserAuthServiceController } from "../controller/user_auth_service_controller";
import { TrainerController } from "../controller/trainer_controller";
import { UserController } from "../controller/user_controller";
import { dependencies } from "../../infrastructure/config/dependency_injector";
import { seedTrainer } from "../../infrastructure/config/seed_data";
import { seedUser } from "../../infrastructure/config/user_data";

import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),

  //Trainers resolver
  Trainer: {
    fcRating: (parent: any, args: any, ctx: any, info: any) => {
      return dependencies.trainerRepository.getFcRating(parent.trainerId);
    },
    plans: (parent: any, args: any, ctx: any, info: any) => {
      return ctx.loader.plans.load(parent.trainerId);
    },
  },

  Query: {
    //Seed trainers to database
    seedTrainers: () => {
      seedTrainer();
      return "Generating User data";
    },

    //Seed users to database
    seedUsers: () => {
      seedUser();
      return "Generating User data";
    },

    //Returns user profile
    me: async (parent: any, args: any, ctx: any, info: any) => {
      return await controllers.userService.getUserProfile(ctx);
    },

    //Returns recommendations for trainers based on their intrests
    recommendations: async (parent: any, args: any, ctx: any, info: any) => {
      return await controllers.trainerService.getTrainerRecommendation(ctx);
    },

    //Returns trainers profile
    trainer: async (parent: any, args: any, ctx: any, info: any) => {
      return await controllers.trainerService.getTrainerProfile(args);
    },

    //Returns my current + previous trainers
    myTrainers: async (parent: any, args: any, ctx: any, info: any) => {
      return await controllers.userService.getMyTrainers(ctx);
    },

    //Returns pending pairing requests
    pairingRequests: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getPairingRequests(ctx);
    },

    //Return pending and previous payments
    myPayments: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getMyPayments(ctx);
    },

    //Search and filter trainers
    searchTrainer: async (parent: any, args: any, ctx: any, info: any) => {
      return await controllers.trainerService.filterAndSearch(args);
    },

    //search and filters users
    filterUsers: async (parent: any, args: any, ctx: any, info: any) => {
      return await controllers.userService.filter(args);
    },

    //Return list of reported trainerIds
    myReportedTrainers: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getMyReportedTrainers(ctx);
    },
  },

  //Mutations
  Mutation: {
    //Login Usres
    loginAsUser: async (parent: any, args: any, ctx: any, info: any) => {
      return await controllers.userAuthService.login(args);
    },

    //Register users
    registerAsUser: async (parent: any, args: any, ctx: any, info: any) => {
      return await controllers.userAuthService.register(args);
    },

    //Add user interests
    addInterests: async (parent: any, args: any, ctx: any, info: any) => {
      //Assign userId to args objett
      args.userId = ctx.userId;
      await controllers.userService.addUserInterests(args);

      return "Added";
    },

    //Subscribe to a plan
    subscribe: async (parent: any, args: any, ctx: any, info: any) => {
      //Assign userId to args objett
      args.userId = ctx.userId;
      await controllers.userService.subscribe(args);

      return "Subscribed";
    },

    //Send pairing request
    sendRequest: async (parent: any, args: any, ctx: any, info: any) => {
      args.senderId = ctx.userId;
      await controllers.userService.sendPairingRequest(args);
      return "Request Sent";
    },

    //Decline pairing request
    declineRequest: async (parent: any, args: any, ctx: any, info: any) => {
      args.receiverId = ctx.userId;
      await controllers.userService.declineRequest(args);
      return "Request Declined";
    },

    //Accept Pairing requests
    acceptRequest: async (parent: any, args: any, ctx: any, info: any) => {
      args.receiverId = ctx.userId;
      await controllers.userService.acceptRequest(args);
      return "Request Accepted";
    },

    //Paying with discounted amount
    payInPair: async (parent: any, args: any, ctx: any, info: any) => {
      args.payeeId = ctx.userId;

      await controllers.userService.payInPair(args);
      return "Paid";
    },

    updateUserLocation: (parent: any, args: any, ctx: any, info: any) => {
      args.userId = ctx.userId; 
      controllers.userService.updateUserProfile(args);
      return "Updated";
    },

    //Report a trainer
    reportTrainer: async (parent: any, args: any, ctx: any, info: any) => {
      args.userId = ctx.userId;
      await controllers.userService.reportTrainer(args);
      return "Reported";
    },
  },
};

const controllers = {
  userAuthService: new UserAuthServiceController(dependencies),
  trainerService: new TrainerController(dependencies),
  userService: new UserController(dependencies),
};
