import { IUserRepository } from "../../application/abstracts/user_repository_interface";
import { IUser } from "../../application/abstracts/user_repository_interface";

export class UserRepository implements IUserRepository {
  getUserByEmail: (email: string) => Promise<IUser>;
  getUserById: (userId: string) => Promise<IUser>;
  registerUser: ({ user_id, name, email, password }: IUser) => Promise<void>;
}
