import { UserAuthServiceController } from "../controller/user_auth_service_controller";
import { TrainerController } from "../controller/trainer_controller";
import { dependencies } from "../../infrastructure/config/dependency_injector";
import { UserRepository } from "../../data_provider/repository/user_repository";
import driver from "../../infrastructure/config/db_config";
import { seedTrainer } from "../../infrastructure/config/seed_data";

export const resolvers = {
  Query: {
    me: () => {
      seedTrainer();
      return "HRushi";
    },
    searchTrainer: (parent: any, args: any, ctx: any, info: any) => 
      controllers.trainerService.filterAndSearch(args),
  },

  Mutation: {
    loginAsUser: (parent: any, args: any, ctx: any, info: any) =>
      controllers.userAuthService.login(args),
    registerAsUser: (parent: any, args: any, ctx: any, info: any) =>
      controllers.userAuthService.register(args),
  },
};

const controllers = {
  userAuthService: new UserAuthServiceController(dependencies),
  trainerService: new TrainerController(dependencies),
};
