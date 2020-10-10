import { IAccessTokenManager } from "../../application/abstracts/access_token_manager_interface";
import  jwt from "jsonwebtoken";

export class AccessTokenManager implements IAccessTokenManager {
  generate = (userId: string): Promise<string> => {
    var token : String;
    token = jwt.sign(userId, 'secretkey');
    return new Promise((reject, resolve) =>{
      resolve(token);
    })
  };

  verify: (token: string) => Promise<boolean>;
}
