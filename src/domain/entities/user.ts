import { IUser } from "../../application/abstracts/user_repository_interface";

class User implements IUser {
  readonly user_id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;

  //constructor
  constructor({
    user_id = "",
    name,
    email,
    password,
  }: {
    user_id?: string;
    name: string;
    email: string;
    password: string;
  }) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  //Serialize data
  hydrate() {
    const { user_id, name, email } = this;
    return {
      userId: user_id,
      name: name,
      email: email,
    };
  }

  validate(): Promise<void> {
    return Promise.reject("NOT IMPLEMENTED");
  }

  //validate
  //   validate() {
  //     const emailRegx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //     const passwordRegx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  //     const isEmailEmpty = this.email.trim().length == 0;
  //     const isPasswordEmpty = this.password.trim().length == 0;
  //     const isNameEmpty = this.name.trim().length == 0;

  //     let valid = true;

  //     if (!emailRegx.test(this.email)) {
  //       valid = false;
  //       this.errorHandler.email = "Enter a valid email address";
  //     }

  //     if (!passwordRegx.test(this.password)) {
  //       valid = false;
  //       this.errorHandler.password =
  //         "Password must contain atleast one uppercase letter, one lowercase letter, a special Character and a number ";
  //     }

  //     if (isEmailEmpty) {
  //       valid = false;
  //       this.errorHandler.email = "Email field should not be empty";
  //     }

  //     if (isPasswordEmpty) {
  //       valid = false;
  //       this.errorHandler.password = "Password field should not be empty";
  //     }

  //     if (isNameEmpty) {
  //       valid = false;
  //       this.errorHandler.name = "Name field should not be empty";
  //     }

  //     if (!valid) {
  //       this.errorHandler.statusCode = 422;
  //       throw (this.errorHandler.message = "Fields Should not be empty");
  //     }
  //   }
}

export default User;
