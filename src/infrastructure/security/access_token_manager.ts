import { IAccessTokenManager } from "../../application/abstracts/access_token_manager_interface";

export class AccessTokenManager implements IAccessTokenManager {
  generate: (userId: string) => Promise<string>;
  verify: (token: string) => Promise<boolean>;
}
