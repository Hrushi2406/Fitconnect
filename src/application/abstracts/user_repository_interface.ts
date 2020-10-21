import { MyPayment, MyTrainer } from "../../domain/return_types";
import Request from "../../domain/relations/request";

export interface IUserRepository {
  //Retrieve user by email
  getUserByEmail: (email: string) => Promise<IUser | null>;

  //Retrieve user by id
  getUserById: (userId: string) => Promise<IUser | null>;

  //Fetch pairing requests to a user
  getRequestsToId: (userId: string) => Promise<[Request] | null>; 

  //Update user
  updateUser: ({ userId, name, email, password, mobile, age, gender, bio, address, imageUrl }: IUser) => Promise<void>;

  //Sign Up user
  registerUser: ({ userId, name, email, password, mobile, age, gender, bio, address, imageUrl, lat, lon }: IUser) => Promise<void>;

  //Send pairing request
  sendRequest: ({senderId, receiverId, planId}: Request) => Promise<void>;
  
  //Delete pairing request
  deleteRequest: ({senderId, receiverId, planId}: Request) => Promise<void>;
  
  //Create Friendship between sender & receiver
  createFriends: ({senderId, receiverId, planId}: Request) => Promise<void>;

  //Subscribe userId to planId for price, assign endDate,
  subscribeToPlan: (userId: string, planId: string, duration:string, price:number) => Promise<void>;
  
  //Pay by payeeId to planId 
  pay: (payeeId: string, partnerId: string, planId: string) => Promise<void>;

  //check if both from pair have paid
  checkPayment: (payeeId: string, partnerId: string, planId: string) => Promise<boolean>;
  
  //Add user Interests
  addUserInterests: (userId: string, interests: string[]) => Promise<void>;

  //Get subscriptions by userId
  getSubsbyUserId: (userId: string) => Promise<[MyTrainer] | null>;
  
  //Get subscriptions by userId
  getAllPairings: (userId: string) => Promise<[MyPayment] | null>;
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
  lat: number;
  lon: number;
  validate: () => Promise<void>;
  hydrate: () => any;
}
