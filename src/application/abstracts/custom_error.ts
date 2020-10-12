import { ApolloError } from "apollo-server";

export class CustomError implements ICustomError {
  //Generic Error message
  public message: string;

  //Error status code
  public code: string = "";

  //Error in email
  public email: string;

  //Error in password
  public password: string;

  //Error in name
  public name: string;

  constructor() {}

  //Throw Error
  throw() {
    const err = new ApolloError(this.message, this.code, {
      email: this.email,
      password: this.password,
      name: this.name,
    });

    this.clear();

    throw err;
  }

  //Clear all field
  clear() {
    this.message = "";

    //Error status code
    this.code = "";

    //Error in email
    this.email = "";

    //Error in password
    this.password = "";
  }
}

export interface ICustomError {
  message: string;
  code: string;
  email: string;
  password: string;
  name: string;
  throw: () => void;
  clear: () => void;
}
