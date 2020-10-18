import { Driver } from "neo4j-driver";
import { ITrainerRepository } from "../../application/abstracts/trainer_repository_interface";
import { ITrainer, Trainer } from "../../domain/entities/trainer"

export class TrainerRepository implements ITrainerRepository {
  //Construtor
  constructor(public db: Driver) { }

  //Get trainer profile
  async getTrainerbyId(trainer_id: string): Promise<any> {
    try {
      const session = this.db.session();

      const cypher: string = "Match ( t:Trainer { trainer_id: $trainer_id } )-[:LIVES]->( l:Geometry ) return t,l";
      const result = await session.run(cypher, { trainer_id: trainer_id });

      session.close();

      if (result.records.length == 0) {
        return null;
      }

      const record = result.records[0];

      const geometry = {
        geometryId: record.get("l").properties.geometry_id,
        lat: record.get("l").properties.lat,
        lon: record.get("l").properties.lon,
        description: record.get("l").properties.description,
      }

      const trainer = {
        trainerId: record.get("t").properties.trainer_id,
        email: record.get("t").properties.email,
        name: record.get("t").properties.name,
        age: record.get("t").properties.age,
        gender: record.get("t").properties.gender,
        address: record.get("t").properties.address,
        bio: record.get("t").properties.bio,
        category: record.get("t").properties.category,
        profession: record.get("t").properties.profession,
        mobile: record.get("t").properties.mobile,
        fcRating: record.get("t").properties.fc_rating,
        images: record.get("t").properties.images,
        minCost: record.get("t").properties.min_cost,
        geometry: geometry,
      }

      return trainer;

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
  ): Promise<any> {

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
          geometryId: record.get("l").properties.geometry_id,
          lat: record.get("l").properties.lat,
          lon: record.get("l").properties.lon,
          description: record.get("l").properties.description,
        }

        const trainer = {
          trainerId: record.get("node").properties.trainer_id,
          email: record.get("node").properties.email,
          name: record.get("node").properties.name,
          age: record.get("node").properties.age,
          gender: record.get("node").properties.gender,
          address: record.get("node").properties.address,
          bio: record.get("node").properties.bio,
          category: record.get("node").properties.category,
          profession: record.get("node").properties.profession,
          mobile: record.get("node").properties.mobile,
          fcRating: record.get("node").properties.fc_rating,
          images: record.get("node").properties.images,
          minCost: record.get("node").properties.min_cost,
          geometry: geometry,
        }

        trainerList.push(trainer);
      })

      return trainerList;
    } catch (err) {
      console.log("Database error in trainer repository: ", err.message);

      throw "Something went wrong";
    }
  }
}
