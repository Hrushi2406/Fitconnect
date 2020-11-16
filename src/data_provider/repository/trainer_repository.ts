import { Driver } from "neo4j-driver";
import { Plan } from "../../domain/entities/plans";
import { ITrainerRepository } from "../../application/abstracts/trainer_repository_interface";
import { ITrainer, Trainer } from "../../domain/entities/trainer";

export class TrainerRepository implements ITrainerRepository {
  //Construtor
  constructor(public db: Driver) {}

  //Get trainer profile by trainerId
  async getTrainerbyId(trainerId: string): Promise<ITrainer | null> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match ( t:Trainer { trainerId: $trainerId } ) return t";
      const result = await session.run(cypher, { trainerId: trainerId });

      session.close();

      if (result.records.length == 0) {
        return null;
      }

      const trainer = new Trainer(result.records[0].get("t").properties);

      return trainer;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Get trainer profile by planId
  async getTrainerbyPlanId(planId: string): Promise<ITrainer | null> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match ( p:Plan { planId: $planId } )<-[:HAS]-(t:Trainer) Return t";
      const result = await session.run(cypher, { planId });

      session.close();

      if (result.records.length == 0) {
        return null;
      }

      const trainer = new Trainer(result.records[0].get("t").properties);

      return trainer;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Get plan by planId
  async getPlanbyId(planId: string): Promise<Plan | null> {
    try {
      const session = this.db.session();

      const cypher: string = "Match (p:Plan {planId:$planId} ) return p";
      const result = await session.run(cypher, { planId });

      session.close();

      if (result.records.length == 0) {
        return null;
      }

      const plan = new Plan(result.records[0].get("p").properties);

      return plan;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Get plans by trainerId
  async getTrainerPlans(trainerId: string): Promise<Plan[]> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match ( t:Trainer { trainerId: $trainerId } )-[:HAS]->( p:Plan ) return p ORDER BY p.type";
      const result = await session.run(cypher, { trainerId: trainerId });

      session.close();

      var planList: Plan[] = [];

      if (result.records.length == 0) {
        return planList;
      }

      result.records.map((record) => {
        const plan = new Plan(record.get("p").properties);
        planList.push(plan);
      });

      return planList;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Get all plans from given list of trainer ids
  async getAllPlansFromTrainerIds(
    trainerIds: readonly string[]
  ): Promise<Map<string, Plan[]>> {
    try {
      const session = this.db.session();

      const cypher: string =
        "MATCH (p:Plan)<-[:HAS]-(t:Trainer) WHERE t.trainerId IN $trainerIds RETURN p,t.trainerId ORDER BY p.type";
      const result = await session.run(cypher, { trainerIds: trainerIds });

      session.close();

      let planList: Map<string, Plan[]> = new Map();

      if (result.records.length == 0) {
        return planList;
      }

      // {"trainerID": [Plans]}
      result.records.map((record) => {
        const plan = new Plan(record.get("p").properties);
        const trainerId = record.get("t.trainerId");
        const currentPlans = planList.get(trainerId);
        if (currentPlans != undefined) {
          currentPlans.push(plan);
          planList.set(trainerId, currentPlans);
        } else {
          planList.set(trainerId, [plan]);
        }
      });

      // return planList;
      return planList;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Get trainers recommended to userId by his interests
  async recommendTrainers(userId: string): Promise<ITrainer[]> {
    try {
      const session = this.db.session();

      const cypher: string =
        "Match (u:User {userId:$userId}) Match (u)-[:OFTYPE]->( c:Category )<-[:OFTYPE]-(t:Trainer) return t ORDER BY t.fcRating DESC";
      const result = await session.run(cypher, { userId });

      session.close();

      let trainerList: Trainer[] = [];

      if (result.records.length == 0) {
        return trainerList;
      }

      result.records.map((record) => {
        const trainer = new Trainer(record.get("t").properties);
        trainerList.push(trainer);
      });

      return trainerList;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Full text search for trainers
  async searchTrainers(
    userLat: number,
    userLong: number,
    maxDistance: number,
    maxPrice: number,
    category: string[],
    minRating: number,
    gender: string,
    age: number,
    keyword: string,
    sortBy: string,
    order: string
  ): Promise<Trainer[]> {
    //TODO: Change categories rto list
    // Queries for all applied filters
    var filterQuery: string = "";

    if (maxDistance != -1) {
      //Convert km into meters
      maxDistance = maxDistance * 1000;
      //Max distance is in meters
      filterQuery +=
        " Match (node) with distance(point({ latitude:$userLat, longitude:$userLong }), point({ latitude: node.lat, longitude: node.lon })) as dist, node as node where dist < $maxDistance";
    }

    if (maxPrice != -1) {
      filterQuery += " Match (node) WHERE node.startPrice <= $maxPrice";
    }

    if (category.length !== 0) {
      filterQuery +=
        " Match (node)-[:OFTYPE]->( c:Category ) WHERE c.name IN $category";
    }

    if (minRating != -1) {
      filterQuery += " Match (node)  WHERE node.fcRating >= $minRating";
    }

    if (gender != "") {
      filterQuery += " Match (node)  WHERE node.gender = $gender";
    }

    if (age != -1) {
      filterQuery += " Match (node) WHERE node.age <= $age";
    }

    // Query based on search keyword
    var keywordQuery: string = "";

    if (keyword == "") {
      keywordQuery = "Match (node:Trainer) ";
    } else {
      keywordQuery =
        "CALL db.index.fulltext.queryNodes('trainer_index', '" +
        keyword +
        "*') YIELD node ";
    }

    // Query if sortBy applied
    var sortQuery: string = "";

    if (sortBy == "dist") {
      sortQuery = ", dist ORDER BY dist " + order;
    } else if (sortBy != "") {
      sortQuery = " ORDER BY node." + sortBy + " " + order;
    }

    //Complete query filters, Full text Search & sorting
    const finalQuery = keywordQuery + filterQuery + " RETURN node" + sortQuery;

    try {
      const session = this.db.session();

      const result = await session.run(finalQuery, {
        userLat: userLat,
        userLong: userLong,
        maxDistance: maxDistance,
        maxPrice: maxPrice,
        category: category,
        minRating: minRating,
        gender: gender,
        age: age,
      });

      session.close();

      let trainerList: Trainer[] = [];

      if (result.records.length == 0) {
        return trainerList;
      }

      result.records.map((record) => {
        const trainer = new Trainer(record.get("node").properties);

        trainerList.push(trainer);
      });

      return trainerList;
    } catch (err) {
      console.log("Database error in trainer repository: ", err.message);

      throw "Something went wrong";
    }
  }
}
