import { AuthenticationError } from "apollo-server";
import { IAccessTokenManager } from "../../../application/abstracts/access_token_manager_interface";
import { IEncrypter } from "../../../application/abstracts/encrypter_interface";
import { IUserRepository } from "../../../application/abstracts/user_repository_interface";
// import User from "src/domain/entities/user";

export class UserLoginUseCase {
  //constructor
  /**
   *
   * @param userRepository
   * @param encrypter
   * @param accessTokenManager
   */
  constructor(
    public userRepository: IUserRepository,
    public encrypter: IEncrypter,
    public accessTokenManager: IAccessTokenManager
  ) {}

  //Executable default functions
  async execute(email: string, password: string): Promise<string> {
    //extracting fron this
    const { userRepository, encrypter, accessTokenManager } = this;

    //Checking user if exists
    const user = await userRepository.getUserByEmail(email);

    //If not throw error
    if (!user) {
      throw new AuthenticationError("You dont have a account");
    }

    //comparing passwords
    const isValid = await encrypter.compare(password, user.password);

    //Checkings is password valid
    if (!isValid) {
      throw new AuthenticationError("You dont have a account");
    }

    //Generating token
    const token = await accessTokenManager.generate(user.user_id);

    //Logg
    console.log("Token generated successfully " + token);

    //returning token
    return token;
  }
}
