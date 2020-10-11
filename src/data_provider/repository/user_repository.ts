import { IUserRepository } from "../../application/abstracts/user_repository_interface";
import { IUser } from "../../application/abstracts/user_repository_interface";
import { Driver } from "neo4j-driver";
import User from "src/domain/entities/user";

export class UserRepository implements IUserRepository {
  //Construtor
  constructor(public db: Driver) {}

  //Returns user details
  async getUserByEmail(email: string): Promise<IUser> {
    try {
      //Wrtire qurery here
      return new User({
        name: "afd",
        email: "dsa",
        password: "Af",
      });
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  getUserById: (userId: string) => Promise<IUser>;
  registerUser: ({ user_id, name, email, password }: IUser) => Promise<void>;
}
