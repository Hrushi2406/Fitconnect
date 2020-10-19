import { Driver } from "neo4j-driver";
import { Plan } from "../../domain/entities/plans";
import { ITrainerRepository } from "../../application/abstracts/trainer_repository_interface";
import { ITrainer, Trainer } from "../../domain/entities/trainer"

export class TrainerRepository implements ITrainerRepository {
  //Construtor
  constructor(public db: Driver) { }

  //Get trainer profile
  async getTrainerbyId(trainerId: string): Promise<Trainer | null> {
    try {
      const session = this.db.session();

      const cypher: string = "Match ( t:Trainer { trainerId: $trainerId } )-[:LIVES]->( l:Geometry ) return t,l";
      const result = await session.run(cypher, { trainerId: trainerId });

      session.close();

      if (result.records.length == 0) {
        return null;
      }

      const record = result.records[0];

      const geometry = {
        geometryId: record.get("l").properties.geometryId,
        lat: record.get("l").properties.lat,
        lon: record.get("l").properties.lon,
        description: record.get("l").properties.description,
      }

      const trainer = new Trainer({
        trainerId: record.get("t").properties.trainerId,
        email: record.get("t").properties.email,
        name: record.get("t").properties.name,
        age: record.get("t").properties.age,
        gender: record.get("t").properties.gender,
        address: record.get("t").properties.address,
        bio: record.get("t").properties.bio,
        category: record.get("t").properties.category,
        profession: record.get("t").properties.profession,
        mobile: record.get("t").properties.mobile,
        fcRating: record.get("t").properties.fcRating,
        images: record.get("t").properties.images,
        startPrice: record.get("t").properties.startPrice,
        geometry: geometry,
      })

      return trainer;

    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Get plans by trainerId
  async getTrainerPlans(trainerId: string): Promise<[Plan] | null> {
    try {
      const session = this.db.session();

      const cypher: string = "Match ( t:Trainer { trainerId: $trainerId } )-[:HAS]->( p:Plan ) return p";
      const result = await session.run(cypher, { trainerId: trainerId });

      session.close();

      if (result.records.length == 0) {
        return null;
      }

      var planList : any = [];
      result.records.map((record)=>{
        const plan = new Plan(record.get("p").properties);
        planList.push(plan);
      })

      return planList;
    } catch (err) {
      console.log("Database error: ", err.message);

      throw "Something went wrong";
    }
  }

  //Full text search & execute the query
  async search(
    userLat: number,
    userLong: number,
    maxDistance: number,
    maxPrice: number,
    category: string,
    minRating: number,
    gender: string,
    age: number,
    keyword: string,
    sortBy: string,
    order: string,
    prevQuery: string,
  ): Promise<[Trainer] | null> {

    var str: string = "";

    if (sortBy != "") {
      str = "ORDER BY node." + sortBy + " " + order;
    }

    //Complete query with FULL TEXT SEARCH
    const finalQuery = "CALL db.index.fulltext.queryNodes('trainer_index', '" + keyword + "') YIELD node " + prevQuery + " Match (node)-[:LIVES]->(l:Geometry) RETURN node, l " + str;

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
        keyword: keyword,
        sortBy: sortBy,
        order: order
      });

      session.close();

      var trainerList: any = [];

      result.records.map((record) => {

        const geometry = {
          geometryId: record.get("l").properties.geometryId,
          lat: record.get("l").properties.lat,
          lon: record.get("l").properties.lon,
          description: record.get("l").properties.description,
        }

        const trainer = new Trainer({
          trainerId: record.get("node").properties.trainerId,
          email: record.get("node").properties.email,
          name: record.get("node").properties.name,
          age: record.get("node").properties.age,
          gender: record.get("node").properties.gender,
          address: record.get("node").properties.address,
          bio: record.get("node").properties.bio,
          category: record.get("node").properties.category,
          profession: record.get("node").properties.profession,
          mobile: record.get("node").properties.mobile,
          fcRating: record.get("node").properties.fcRating,
          images: record.get("node").properties.images,
          startPrice: record.get("node").properties.startPrice,
          geometry: geometry,
        })

        trainerList.push(trainer);
      })

      return trainerList;
    } catch (err) {
      console.log("Database error in trainer repository: ", err.message);

      throw "Something went wrong";
    }
  }
}
