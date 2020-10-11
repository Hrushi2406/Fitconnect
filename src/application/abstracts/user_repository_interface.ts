export interface IUserRepository {
  //Retrieve user by email
  getUserByEmail: (email: string) => Promise<IUser | null>;

  //Retrieve user by id
  getUserById: (userId: string) => Promise<IUser | null>;

  //Sign Up user
  registerUser: ({ user_id, name, email, password }: IUser) => Promise<void>;
}

export interface IUser {
  user_id: string;
  name: string;
  email: string;
  password: string;
  // age: number;
  // gender: string;
  // bio: string;
  // address: string;
  // image_url: string;
  // Geometry
  validate: () => Promise<void>;
  hydrate: () => any;
}
