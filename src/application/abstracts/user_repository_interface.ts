export interface IUserRepository {
  //Retrieve user by email
  getUserByEmail: (email: string) => Promise<IUser | null>;

  //Retrieve user by id
  getUserById: (userId: string) => Promise<IUser | null>;

  //Update user
  updateUser: ({ userId, name, email, password, mobile, age, gender, bio, address, imageUrl }: IUser) => Promise<void>;

  //Sign Up user
  registerUser: ({ userId, name, email, password, mobile, age, gender, bio, address, imageUrl }: IUser) => Promise<void>;
}

export interface IUser {
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
  validate: () => Promise<void>;
  hydrate: () => any;
}
