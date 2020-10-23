import { AccessTokenManager } from "../../infrastructure/security/access_token_manager";

let accessTokenManager: AccessTokenManager = new AccessTokenManager();

function auth(req: any): any {
  const token = req.headers.authorization;

  if (!token) {
    return null;
  } else {
    try {
      const decodedToken = accessTokenManager.verify(token);
      return decodedToken;
    } catch (err) {
      console.log("Error accoured while verifying JWT ");
      return null;
    }
  }
}

export default auth;
