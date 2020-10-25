import { AuthenticationError } from "apollo-server";
import { ICustomError } from "../../../application/abstracts/custom_error";
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
    public accessTokenManager: IAccessTokenManager,
    public customError: ICustomError
  ) {}

  //Executable default functions
  async execute(email: string, password: string): Promise<string> {
    //extracting fron this
    const { userRepository, encrypter, accessTokenManager, customError } = this;

    //Checking user if exists
    const user = await userRepository.getUserByEmail(email);

    //If not throw error
    if (!user) {
      customError.message = "You don't have a account";
      throw (customError.message = "You don't have a account");
    }

    //comparing passwords
    const isValid = await encrypter.compare(password, user.password);

    //Checkings is password valid
    if (!isValid) {
      customError.message = "Invalid Password";
      throw (customError.password = "Invalid Password");
    }

    //Generating token
    const token = await accessTokenManager.generate(user.userId);

    //Logg
    console.log("Token generated successfully " + token);

    //returning token
    return token;
  }
}
