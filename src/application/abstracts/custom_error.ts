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
    throw new ApolloError(this.message, this.code, {
      email: this.email,
      password: this.password,
      name: this.name,
    });
  }
}

export interface ICustomError {
  message: string;
  code: string;
  email: string;
  password: string;
  name: string;
}
