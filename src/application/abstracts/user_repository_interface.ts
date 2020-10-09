export interface IUserRepository {
  //Retrieve user by email
  getUserByEmail: (email: string) => Promise<IUser>;

  //Retrieve user by id
  getUserById: (userId: string) => Promise<IUser>;

  //Sign Up user
  registerUser: ({ user_id, name, email, password }: IUser) => Promise<void>;
}

export interface IUser {
  user_id: string;
  name: string;
  email: string;
  password: string;
  validate: () => Promise<void>;
  hydrate: () => any;
}
