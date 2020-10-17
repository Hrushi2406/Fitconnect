import { Driver } from "neo4j-driver";
import { IUserRepository } from "../../application/abstracts/user_repository_interface";
import { IUser } from "../../application/abstracts/user_repository_interface";
import User from "../../domain/entities/user";

export class UserRepository implements IUserRepository {
  //Construtor
  constructor(public db: Driver) {}

  //Returns user details
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const session = this.db.session();

      const cypher: string = "Match ( u:User { email : $email } ) Return u";
      const result = await session.run(cypher, { email });

      session.close();

      if (!result.records.length) {
        return null;
      }

      const user: IUser = result.records[0].get("u").properties;

      return new User(user);
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const session = this.db.session();

      const cypher: string = "Match ( u:User { user_id : $userId } ) Return u";
      const result = await session.run(cypher, { userId });

      session.close();

      if (!result.records.length) {
        return null;
      }
      const user: IUser = result.records[0].get("u").properties;

      return new User(user);
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  async registerUser({ user_id, name, email, password }: IUser): Promise<void> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Create (u:User {user_id:$user_id, name:$name, email:$email, password:$password})";
      await session.run(cypher, { user_id, name, email, password });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }
}
