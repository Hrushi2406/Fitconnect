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

  Query: {
    me: () => {
      seedTrainer();
      return "HRushi";
    },
    user: () => {
      seedUser();
      return "Generating User data";
    },
    searchTrainer: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.filterAndSearch(args);
    },
    getUserProfile: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getUserProfile(args);
    },
    getTrainerProfile: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerProfile(args);
    },
    getTrainerPlans: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerPlans(args);
    },
    getPairingRequests: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getPairingRequests(args);
    },
    getTrainerbyPlanId: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerbyPlanId(args);
    },
    getPlanbyId: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getPlanbyId(args);
    },
    getTrainerRecommendation: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerRecommendation(args);
    },
    getMyTrainers: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getMyTrainers(args);
    },
    getMyPayments: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userService.getMyPayments(args);
    },
  },

  Mutation: {
    loginAsUser: (parent: any, args: any, ctx: any, info: any) => {
      console.log(ctx);
      return controllers.userAuthService.login(args);
    },
    registerAsUser: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userAuthService.register(args);
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
    subscribe: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userService.subscribe(args);
      return "Subscribed";
    },
    payInPair: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userService.payInPair(args);
      return "Paid";
    },
    addUserInterests: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userService.addUserInterests(args);
      return "Added";
    },
  },
};

const controllers = {
  userAuthService: new UserAuthServiceController(dependencies),
  trainerService: new TrainerController(dependencies),
  userService: new UserController(dependencies),
};
