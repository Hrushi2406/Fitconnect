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
      
      const cypher: string = "Match ( u:User { userId: $userId } ) Return u";
      const result = await session.run(cypher, { userId: userId });

      session.close();

      if (result.records.length == 0) {
        return null;
      }
      const user: IUser = result.records[0].get("u").properties;

      return new User(user);
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  async updateUser({ userId, name, email, password, mobile, age, gender, bio, address, imageUrl }: IUser): Promise<void> {
    try {
      const session = this.db.session();
      
      const cypher: string =
        "Match (u:User {userId:$userId} ) SET u.name=$name, u.mobile=$mobile, u.age=$age, u.gender=$gender, u.bio=$bio, u.address=$address";
      await session.run(cypher, { userId, name, email, password, mobile, age, gender, bio, address, imageUrl });
      
      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  async registerUser({ userId, name, email, password, mobile, age, gender, bio, address, imageUrl }: IUser): Promise<void> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Create (u:User {userId:$userId, name:$name, email:$email, password:$password, mobile:$mobile, age:$age, gender:$gender, bio:$bio, address:$address, imageUrl:$imageUrl})";
      await session.run(cypher, { userId, name, email, password, mobile, age, gender, bio, address, imageUrl });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }
}
