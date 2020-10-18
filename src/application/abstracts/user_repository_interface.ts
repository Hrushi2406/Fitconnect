export interface IUserRepository {
  //Retrieve user by email
  getUserByEmail: (email: string) => Promise<IUser | null>;

  //Retrieve user by id
  getUserById: (userId: string) => Promise<IUser | null>;

  //Update user
  updateUser: ({ user_id, name, email, password, mobile, age, gender, bio, address, image_url }: IUser) => Promise<void>;

  //Sign Up user
  registerUser: ({ user_id, name, email, password, mobile, age, gender, bio, address, image_url }: IUser) => Promise<void>;
}

export interface IUser {
  user_id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  age: number;
  gender: string;
  bio: string;
  address: string;
  image_url: string;
  validate: () => Promise<void>;
  hydrate: () => any;
}
