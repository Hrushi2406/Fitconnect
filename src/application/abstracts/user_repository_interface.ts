import { MyPayment, MyTrainer } from "../../domain/return_types";
import Request from "../../domain/relations/request";
import User from "../../domain/entities/user";

export interface IUserRepository {
  //Retrieve user by email
  getUserByEmail: (email: string) => Promise<IUser | null>;

  //Retrieve user by id
  getUserById: (userId: string) => Promise<IUser | null>;

  //Fetch pairing requests to a user
  getRequestsToId: (userId: string) => Promise<Request[]>;

  //Update user
  updateUser: (
    userId: string,
    lat: number,
    lon: number,
  ) => Promise<void>;

  //Sign Up user
  registerUser: ({
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
  }: IUser) => Promise<void>;

  //Send pairing request
  sendRequest: ({
    senderId,
    receiverId,
    planId,
  }: {
    senderId: string;
    receiverId: string;
    planId: string;
  }) => Promise<void>;

  //Delete pairing request
  deleteRequest: ({
    senderId,
    receiverId,
    planId,
  }: {
    senderId: string;
    receiverId: string;
    planId: string;
  }) => Promise<void>;

  //Delete friendship
  deleteFriendship: ({
    senderId,
    receiverId,
    planId,
  }: {
    senderId: string;
    receiverId: string;
    planId: string;
  }) => Promise<void>;

  //Create Friendship between sender & receiver
  createFriends: ({
    senderId,
    receiverId,
    planId,
  }: {
    senderId: string;
    receiverId: string;
    planId: string;
  }) => Promise<void>;

  //Subscribe userId to planId for price, assign endDate,
  subscribeToPlan: (
    userId: string,
    planId: string,
    duration: string,
    price: number
  ) => Promise<void>;

  //Pay by payeeId to planId
  pay: (payeeId: string, partnerId: string, planId: string) => Promise<void>;

  //check if both from pair have paid
  checkPayment: (
    payeeId: string,
    partnerId: string,
    planId: string
  ) => Promise<boolean>;

  //Add user Interests
  addUserInterests: (userId: string, interests: string[]) => Promise<void>;

  //Get subscriptions by userId
  getSubsbyUserId: (userId: string) => Promise<MyTrainer[]>;

  //Get subscriptions by userId
  getAllPairings: (userId: string) => Promise<MyPayment[]>;

  //Get reported Trainers
  getReportedTrainers: (userId: string) => Promise<string[]>;

  //Report trainer
  reportTrainer: (userId: string, trainerId: string) => Promise<void>;

  //Filter users
  filterUsers: (
    userLat: number,
    userLong: number,
    maxDistance: number,
    category: string[],
    gender: string,
    age: number,
    sortBy: string,
    order: string
  ) => Promise<User[]>;
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
