import { UserAuthServiceController } from "../controller/user_auth_service_controller";
import { TrainerController } from "../controller/trainer_controller";
import { UserProfileController } from "../controller/user_profile_controller";
import { dependencies } from "../../infrastructure/config/dependency_injector";
import { seedTrainer } from "../../infrastructure/config/seed_data";
import { seedUser } from "../../infrastructure/config/user_data";

export const resolvers = {
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
      return controllers.userProfileService.getUserProfile(args);
    },
    getTrainerProfile: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerProfile(args);
    },
    getTrainerPlans: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.trainerService.getTrainerPlans(args);
    },
  },

  Mutation: {
    loginAsUser: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userAuthService.login(args);
    },
    registerAsUser: (parent: any, args: any, ctx: any, info: any) => {
      return controllers.userAuthService.register(args);
    },
    updateUserProfile: (parent: any, args: any, ctx: any, info: any) => {
      controllers.userProfileService.updateUserProfile(args);
      return "Updated";
    },
  },
};

const controllers = {
  userAuthService: new UserAuthServiceController(dependencies),
  trainerService: new TrainerController(dependencies),
  userProfileService: new UserProfileController(),
};
