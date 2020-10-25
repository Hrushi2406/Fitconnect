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
    me: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getUserProfile(ctx);
    },

    //Returns recommendations for trainers based on their intrests
    recommendations: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerRecommendation(ctx);
    },

    //Returns trainers profile
    trainer: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerProfile(args);
    },

    //Returns my current + previous trainers
    myTrainers: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getMyTrainers(ctx);
    },

    searchTrainer: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.filterAndSearch(args);
    },

    // getUserProfile: (parent: any, args: any, ctx: any, info: any) => {
    //   return controllers.userService.getUserProfile(args);
    // },

    getPairingRequests: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getPairingRequests(args);
    },
    getTrainerbyPlanId: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerbyPlanId(args);
    },
    getPlanbyId: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getPlanbyId(args);
    },

    getMyTrainers: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getMyTrainers(args);
    },
    getMyPayments: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getMyPayments(args);
    },
  },

  //Mutations
  Mutation: {
    //Login Usres
    loginAsUser: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userAuthService.login(args);
    },

    //Register users
    registerAsUser: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userAuthService.register(args);
    },

    //Add user interests
    addInterests: (parent: any, args: any, ctx: any, info: any) => {
      //Assign userId to args objett
      args.userId = ctx.userId;
      controllers.userService.addUserInterests(args);

      return "Added";
    },

    //Subscribe to a plan
    subscribe: (parent: any, args: any, ctx: any, info: any) => {
      //Assign userId to args objett
      args.userId = ctx.userId;
      controllers.userService.subscribe(args);

      return "Subscribed";
    },

    updateUserProfile: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userService.updateUserProfile(args);
      return "Updated";
    },
    sendPairingRequest: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userService.sendPairingRequest(args);
      return "Request Sent";
    },
    declineRequest: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userService.declineRequest(args);
      return "Request Declined";
    },
    acceptRequest: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userService.acceptRequest(args);
      return "Request Accepted";
    },

    payInPair: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userService.payInPair(args);
      return "Paid";
    },
  },
};

const controllers = {
  userAuthService: new UserAuthServiceController(dependencies),
  trainerService: new TrainerController(dependencies),
  userService: new UserController(dependencies),
};
