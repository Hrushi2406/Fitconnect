import { Driver } from "neo4j-driver";
import { ITrainerRepository } from "../../application/abstracts/trainer_repository_interface";
import { ITrainer, Trainer } from "../../domain/entities/trainer"

export class TrainerRepository implements ITrainerRepository {
  //Construtor
  constructor(public db: Driver) {}

  //Filter by max distance
  distanceFilter(prevQuery: string): string{

    //Spatial query
    prevQuery += " Match (node)-[:LIVES]->(l:Geometry) WHERE distance(point({ latitude: $userLat, longitude: $userLong }), point({ latitude: l.lat, longitude: l.long })) < $maxDistance";
    return prevQuery;
  }
  
  //Filter by starting price
  priceFilter(prevQuery: string): string{

    //Starting price query
    prevQuery += " Match (node)  WHERE node.min_cost < $maxPrice";
    return prevQuery;
  }

  //Filter by category
  categoryFilter(prevQuery: string): string{

    //Category query
    prevQuery += " Match (node)-[:OFTYPE]->( c:Category{ name:$category } )";
    return prevQuery;
  }

  //Filter by min rating
  ratingFilter(prevQuery: string): string{
    
    //Min Rating query
    prevQuery += " Match (node)  WHERE node.fc_rating >= $minRating";
    return prevQuery;
  }
  
  //Filter by gender
  genderFilter(prevQuery: string): string{
    
    //Gender query
    prevQuery += " Match (node)  WHERE node.gender = $gender";
    return prevQuery;
  }

  //Filter by age
  ageFilter(prevQuery: string): string{
    
    //Age query
    prevQuery += " Match (node) WHERE node.age <= $age";
    return prevQuery;
  }

  //Full text search & execute the query
  async execute(
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

      if(sortBy != ""){
        str = "ORDER BY node."+sortBy+" "+ order;
      }
  
      //Complete query with FULL TEXT SEARCH
      prevQuery = "CALL db.index.fulltext.queryNodes('trainer_index', '" +keyword+ "') YIELD node "+ prevQuery +" Match (node)-[:LIVES]->(l:Geometry) RETURN node, l " +str;

      try {
        const session = this.db.session();
  
        const result = await session.run(prevQuery, { 
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
        console.log("Database error: ", err.message);
  
        throw "Something went wrong";
      }
  }
}
