import { IAccessTokenManager } from "src/application/abstracts/access_token_manager_interface";
import { IEncrypter } from "../../../application/abstracts/encrypter_interface";
import { IIDGenerator } from "../../../application/abstracts/id_generator_interface";
import {
  IUser,
  IUserRepository,
} from "../../../application/abstracts/user_repository_interface";
import { ICustomError } from "../../../application/abstracts/custom_error";
import User from "../../../domain/entities/user";

export class UserRegisterUseCase {
  //Default constructor
  /**
   *
   * @param userRepository
   * @param idGenerator
   * @param encrypter
   * @param accessTokenManager
   */
  constructor(
    public userRepository: IUserRepository,
    public idGenerator: IIDGenerator,
    public encrypter: IEncrypter,
    public accessTokenManager: IAccessTokenManager,
    public customError: ICustomError
  ) {}

  //Default executable function

  async execute(args: any): Promise<string> {
    //Extracting values
    const { accessTokenManager, userRepository, encrypter, idGenerator } = this;

    //Extract from args
    const {
      userId,
      name,
      email,
      password,
      mobile,
      age, 
      gender, 
      bio, 
      address, 
      imageUrl,
      lat,
      lon,
    }: {
      userId: string;
      name: string;
      email: string;
      password: string;
      mobile: string;
      age: number;
      gender: string;
      bio: string;
      address: string;
      imageUrl: string;
      lat: number;
      lon: number;
    } = args;

    //Construct a new object of user
    const user: IUser = new User({
      userId: userId,
      name: name,
      email: email,
      password: password,
      mobile: mobile,
      age: age,
      gender: gender,
      bio: bio, 
      address: address,
      imageUrl: imageUrl,
      lat: lat,
      lon: lon,
    });

    // await user.validate();

    //Encrypte password with bcrypt
    user.password = await encrypter.encrypt(user.password);

    //Genereate a uniuque ID
    user.userId = idGenerator.generate();

    //Add To Database
    await userRepository.registerUser(user);

    //Generate a JWT Token
    const token: string = await accessTokenManager.generate(user.userId);

    //Log
    console.log("Token Generated Successfully " + token);

    //Return
    return token;
  }
}
