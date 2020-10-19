import { UserRepository } from "../../data_provider/repository/user_repository"
import { dependencies } from "../../infrastructure/config/dependency_injector";
import User from "../../domain/entities/user"
import { CustomError } from "../../application/abstracts/custom_error";
import  db from "../../infrastructure/config/db_config";

export class UserProfileController {

  //constructor
  constructor() {}

  //Get Profile
  async getUserProfile({userId}: {userId:string}): Promise<User | null> {
    try {

      //Get user
      const user: User | null = await dependencies.userRepository.getUserById(userId);
        
      if(!user){
          return null;
      }

      //Return the user
      return user;
    } catch (err) {
      //Format Error Message
      throw dependencies.customError.throw();
    }
  }

  //Update Profile
  async updateUserProfile(args: any): Promise<void> {
    try {

      //Get user
      await dependencies.userRepository.updateUser(args);

    } catch (err) {
      //Format Error Message
      throw dependencies.customError.throw();
    }
  }
}

