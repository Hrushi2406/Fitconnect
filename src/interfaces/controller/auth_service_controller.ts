import { LoginUseCase } from "src/application/use_cases/auth_services/login_use_case";
import { RegisterUseCase } from "src/application/use_cases/auth_services/register_use_case";
import { IDependencies } from "../../application/abstracts/dependencies_interface";
// import { AuthService } from "../../application/use_cases/auth_services/auth_service";

export class AuthServiceController {
  //UseCases
  private loginUseCase: LoginUseCase;
  private registerUseCase: RegisterUseCase;

  //constructor
  constructor(public dependencies: IDependencies) {
    this.loginUseCase = new LoginUseCase(
      dependencies.userRepository,
      dependencies.encrypter,
      dependencies.accessTokenManager
    );
    this.registerUseCase = new RegisterUseCase(
      dependencies.userRepository,
      dependencies.idGenerator,
      dependencies.encrypter,
      dependencies.accessTokenManager
    );
  }

  //login
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Itoken> {
    //Get token from use case
    const token: string = await this.loginUseCase.execute(email, password);

    //Return the token
    return { token };
  }

  //Register
  async register(args: any): Promise<Itoken> {
    //Get toke from the use case
    const token: string = await this.registerUseCase.execute(args);

    //Return the token
    return { token };
  }
}

interface Itoken {
  token: string;
}
