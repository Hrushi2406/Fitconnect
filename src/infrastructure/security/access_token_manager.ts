import { IAccessTokenManager } from "../../application/abstracts/access_token_manager_interface";
import jwt from "jsonwebtoken";
import process from "process";

export class AccessTokenManager implements IAccessTokenManager {
  //Generate a JWT token
  async generate(userId: string): Promise<string> {
    try {
      const token = jwt.sign(userId, process.env.SECRET_KEY as string);

      return token;
    } catch (err) {
      //Logger
      console.log("Error while generating token ", err.message);

      throw "Something went wrong";
    }
  }

  async verify(token: string): Promise<string> {
    try {
      const result = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      ) as string;

      return result;
    } catch (err) {
      //Logger
      console.log("Error while Verifying token ", err.message);

      throw err.message;
    }
  }
}
