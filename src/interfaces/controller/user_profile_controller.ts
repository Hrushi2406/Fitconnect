import { UserRepository } from "../../data_provider/repository/user_repository"
import { IUser } from "../../application/abstracts/user_repository_interface";
import User from "../../domain/entities/user"
import { CustomError } from "../../application/abstracts/custom_error";
import  db from "../../infrastructure/config/db_config";

export class UserProfileController {
  //Dependencies
  private userRepository: UserRepository = new UserRepository(db);
  private customError: CustomError = new CustomError();

  //constructor
  constructor() {}

  //Get Profile
  async getUserProfile({user_id}: {user_id:string}): Promise<any> {
    try {

      //Get user
      const user: User | null = await this.userRepository.getUserById(user_id);
        
      if(!user){
          return null;
      }

      //Return the user
      return user.hydrate();
    } catch (err) {
      //Format Error Message
      throw this.customError.throw();
    }
  }

  //Update Profile
  async updateUserProfile(args: any): Promise<void> {
    try {

      //Get user
      await this.userRepository.updateUser(args);

    } catch (err) {
      //Format Error Message
      throw this.customError.throw();
    }
  }
}

