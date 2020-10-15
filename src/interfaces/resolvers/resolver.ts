import { UserAuthServiceController } from "../controller/user_auth_service_controller";
// const AuthServiceController = require("../controller/auth_service_controller")
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
};
