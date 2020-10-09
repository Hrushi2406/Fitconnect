import { IUserRepository } from "./user_repository_interface";
import { IAccessTokenManager } from "./access_token_manager_interface";
import { IEncrypter } from "./encrypter_interface";
import { ICustomError } from "./custom_error";
import { IIDGenerator } from "./id_generator_interface";

export interface IDependencies {
  //GENERAL

  //Error Handler
  customError: ICustomError;
  //Value Encrypter using bcrypt
  encrypter: IEncrypter;
  //JWT Token Manager
  accessTokenManager: IAccessTokenManager;
  //Unique ID generator using UUIDV4
  idGenerator: IIDGenerator;

  //REPOSITORY

  //User Repository
  userRepository: IUserRepository;
}
