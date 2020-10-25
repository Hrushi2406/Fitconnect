import { Date as NeoDate, Driver } from "neo4j-driver";
import Request from "../../domain/relations/request";
import { IUserRepository } from "../../application/abstracts/user_repository_interface";
import { IUser } from "../../application/abstracts/user_repository_interface";
import User from "../../domain/entities/user";
import { MyPayment, MyTrainer } from "../../domain/return_types";
import { Plan } from "../../domain/entities/plans";
import { Trainer } from "../../domain/entities/trainer";
import Subscription from "../../domain/relations/subscription";
import Friendship from "../../domain/relations/friendship";

export class UserRepository implements IUserRepository {
  //Construtor
  constructor(public db: Driver) {}

  //Returns user details
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const session = this.db.session();

      const cypher: string = "Match ( u:User { email : $email } ) Return u";
      const result = await session.run(cypher, { email });

      session.close();

      if (!result.records.length) {
        return null;
      }

      const user: IUser = result.records[0].get("u").properties;

      return new User(user);
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const session = this.db.session();

      const cypher: string = "Match ( u:User { userId: $userId } ) Return u";
      const result = await session.run(cypher, { userId: userId });

      session.close();

      if (result.records.length == 0) {
        return null;
      }
      const user: IUser = result.records[0].get("u").properties;

      return new User(user);
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  async updateUser({
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
  }: IUser): Promise<void> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User {userId:$userId} ) SET u.name=$name, u.mobile=$mobile, u.age=$age, u.gender=$gender, u.bio=$bio, u.address=$address";
      await session.run(cypher, {
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
      });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  async registerUser({
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
  }: IUser): Promise<void> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Create (u:User {userId:$userId, name:$name, email:$email, password:$password, mobile:$mobile, age:$age, gender:$gender, bio:$bio, address:$address, imageUrl:$imageUrl, lat:$lat, lon:$lon})";
      await session.run(cypher, {
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
      });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Fetch pairing requests to a user
  async getRequestsToId(userId: string): Promise<Request[]> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User)-[r:REQUESTED]->(v:User{userId:$userId}) Match (p:Plan {planId:r.planId}) Match(t:Trainer)-[:HAS]-(p) Return u,p,t";
      const result = await session.run(cypher, { userId: userId });

      session.close();

      let reqList: Request[] = [];

      if (result.records.length == 0) {
        return reqList;
      }

      result.records.map((record) => {
        const req = new Request({
          sender: record.get("u").properties,
          trainer: record.get("t").properties,
          receiverId: userId,
          forPlan: record.get("p").properties,
        });

        reqList.push(req);
      });

      return reqList;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Send pairing request
  async sendRequest({
    senderId,
    receiverId,
    planId,
  }: {
    senderId: string;
    receiverId: string;
    planId: string;
  }): Promise<void> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User{userId:$senderId}) Match (v:User{userId:$receiverId}) Create (u)-[:REQUESTED{planId:$planId}]->(v)";
      await session.run(cypher, { senderId, receiverId, planId });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Delete pairing request
  async deleteRequest({
    senderId,
    receiverId,
    planId,
  }: {
    senderId: string;
    receiverId: string;
    planId: string;
  }): Promise<void> {
    //RECEIVER Id = CURRENT USER
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User{userId:$senderId})-[r:REQUESTED{planId:$planId}]->(v:User{userId:$receiverId}) Delete r";

      await session.run(cypher, {
        senderId,
        receiverId,
        planId,
      });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Create Friendship between sender & receiver
  async createFriends({
    senderId,
    receiverId,
    planId,
  }: {
    senderId: string;
    receiverId: string;
    planId: string;
  }): Promise<void> {
    //RECEIVER Id = CURRENT USER
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User{userId:$senderId}) Match (v:User{userId:$receiverId}) Create (u)-[:FRIENDOF{planId:$planId,paid:[]}]->(v)";
      await session.run(cypher, { senderId, receiverId, planId });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Subscribe userId to planId for price, assign endDate,
  async subscribeToPlan(
    userId: string,
    planId: string,
    duration: string,
    price: number
  ): Promise<void> {
    try {
      const session = this.db.session();

      let endDate: Date = new Date();

      if (duration == "Weekly") {
        endDate.setDate(endDate.getDate() + 7);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const eYear = Math.floor(endDate.getFullYear());
      const eMonth = Math.floor(endDate.getMonth());
      const eDate = Math.floor(endDate.getDate());

      const cypher: string =
        "Match (u:User {userId:$userId} ) Match (p:Plan {planId:$planId} ) Create (u)-[:SUBSCRIBED {startDate: date(), endDate:date({year:apoc.convert.toInteger($eYear), month:apoc.convert.toInteger($eMonth), day:apoc.convert.toInteger($eDate)}), price:$price}]->(p) ";
      const result = await session.run(cypher, {
        userId,
        planId,
        eYear,
        eMonth,
        eDate,
        price,
      });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Pay by payeeId to planId
  async pay(payeeId: string, partnerId: string, planId: string): Promise<void> {
    //Payee Id CURRENT USER
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User{userId:$payeeId})-[f:FRIENDOF{planId:$planId}]-(v:User{userId:$partnerId}) SET f.paid = f.paid + $payeeId";
      await session.run(cypher, { payeeId, partnerId, planId });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //check if both from pair have paid
  async checkPayment(
    payeeId: string,
    partnerId: string,
    planId: string
  ): Promise<boolean> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User{userId:$payeeId})-[f:FRIENDOF{planId:$planId}]-(v:User{userId:$partnerId}) return $payeeId In f.paid as b";
      const result = await session.run(cypher, { payeeId, partnerId, planId });

      session.close();

      const paid: boolean = result.records[0].get("b");

      return paid;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Add user Interests
  async addUserInterests(userId: string, interests: string[]): Promise<void> {
    try {
      const session = this.db.session();

      const cypher = `MATCH (u:User{userId:$userId}) Match (c:Category) WHERE c.name In $interests Create (u)-[:OFTYPE]->(c)`;

      //CREATING RELATIONHIP WITH CATEGORY
      await session.run(cypher, { userId, interests });

      session.close();
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Get subscriptions by userId
  async getSubsbyUserId(userId: string): Promise<MyTrainer[]> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User {userId:$userId} )-[s:SUBSCRIBED]->(p:Plan)<-[:HAS]-(t:Trainer) return p, t, s order by s.startDate desc";
      const result = await session.run(cypher, { userId: userId });

      session.close();

      let myTrainerList: MyTrainer[] = [];

      if (result.records.length == 0) {
        return myTrainerList;
      }

      result.records.map((record) => {
        const myTrainer = new MyTrainer({
          forPlan: new Plan(record.get("p").properties),
          trainer: new Trainer(record.get("t").properties),
          sub: new Subscription(record.get("s").properties),
        });

        myTrainerList.push(myTrainer);
      });

      return myTrainerList;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Get pairings by userId
  async getAllPairings(userId: string): Promise<MyPayment[]> {
    try {
      const session = this.db.session();

      const cypher: string =
        "match (u:User{userId:$userId})-[f:FRIENDOF]-(v:User) match (p:Plan{planId:f.planId})<-[:HAS]-(t:Trainer) return p, t, v, f;";
      const result = await session.run(cypher, { userId: userId });

      session.close();

      let myPaymentList: MyPayment[] = [];

      if (result.records.length == 0) {
        return myPaymentList;
      }

      result.records.map((record) => {
        const myPayment = new MyPayment({
          forPlan: new Plan(record.get("p").properties),
          trainer: new Trainer(record.get("t").properties),
          partner: new User(record.get("v").properties),
          friendship: new Friendship(record.get("f").properties),
        });

        myPaymentList.push(myPayment);
      });

      return myPaymentList;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  async filterUsers(
    userLat: number,
    userLong: number,
    maxDistance: number,
    category: string[],
    gender: string,
    age: number,
    sortBy: string,
    order: string
  ): Promise<User[]> {
    // Queries for all applied filters
    var filterQuery: string = "Match (n:User)";

    if (maxDistance != -1) {
      //Convert km into meters
      maxDistance = maxDistance * 1000;
      //Max distance is in meters
      filterQuery +=
        " Match (n) with distance(point({ latitude:$userLat, longitude:$userLong }), point({ latitude: n.lat, longitude: n.lon })) as dist, n as n where dist < $maxDistance";
    }

    if (category.length !== 0) {
      filterQuery +=
        " Match (n)-[:OFTYPE]->( c:Category ) WHERE c.name IN $category";
    }

    if (gender != "") {
      filterQuery += " Match (n)  WHERE n.gender = $gender";
    }

    if (age != -1) {
      filterQuery += " Match (n) WHERE n.age <= $age";
    }

    // Query if sortBy applied
    var sortQuery: string = "";

    if (sortBy == "dist") {
      sortQuery = ", dist ORDER BY dist " + order;
    } else if (sortBy != "") {
      sortQuery = " ORDER BY n." + sortBy + " " + order;
    }

    //Complete query filters, & sorting
    const finalQuery = filterQuery + " RETURN n" + sortQuery;

    try {
      const session = this.db.session();

      const result = await session.run(finalQuery, {
        userLat: userLat,
        userLong: userLong,
        maxDistance: maxDistance,
        category: category,
        gender: gender,
        age: age,
      });

      session.close();

      let usersList: User[] = [];

      if (result.records.length == 0) {
        return usersList;
      }

      result.records.map((record) => {
        const users = new User(record.get("n").properties);

        usersList.push(users);
      });

      return usersList;
    } catch (err) {
      console.log("Database error in trainer repository: ", err.message);

      throw "Something went wrong";
    }
  }
}
