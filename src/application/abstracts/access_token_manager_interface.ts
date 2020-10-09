export interface IAccessTokenManager {
  //generate a new access token
  generate: (userId: string) => Promise<string>;

  //verify a  access token
  verify: (token: string) => Promise<boolean>;
}
