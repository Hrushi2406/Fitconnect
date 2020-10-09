import { AuthServiceController } from "../controller/auth_service_controller";
// const AuthServiceController = require("../controller/auth_service_controller")
import { dependencies } from "../../infrastructure/config/dependency_injector";

export const resolvers = {
  Query: {
    // me: () => "HRUSHIE",
    login: (parent: any, args: any, ctx: any, info: any) =>
      controllers.authService.login(args),
  },
};

const controllers = {
  authService: new AuthServiceController(dependencies),
};
