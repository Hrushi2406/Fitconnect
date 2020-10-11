import { IAccessTokenManager } from "../../application/abstracts/access_token_manager_interface";
import jwt from "jsonwebtoken";

export class AccessTokenManager implements IAccessTokenManager {
  //Generate a JWT token
  async generate(userId: string): Promise<string> {
    try {
      const token = jwt.sign(userId, "littlesecret");
      
      return token;
    } catch (err) {
      //Logger
      console.log("Error while generating token ", err.message);

      throw "Something went wrong";
    }
  }

  verify: (token: string) => Promise<boolean>;
}
