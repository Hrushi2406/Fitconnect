import { ICustomError } from "../../../application/abstracts/custom_error";
import { ITrainerRepository } from "../../../application/abstracts/trainer_repository_interface";
import { ITrainer } from "../../../domain/entities/trainer"
// import User from "src/domain/entities/user";

export class SearchUseCase {
  //constructor
  
  constructor(
    public trainerRepository: ITrainerRepository,
    public customError: ICustomError
  ) {}

  //Executable default functions
  async execute (
    userLat: number,
    userLong: number,
    maxDistance: number,
    maxPrice: number,
    category: string,
    minRating: number,
    gender: string,
    age: number,
    sortBy: string,
    order: string,
    keyword: string): Promise<any>{

    //extracting fron this
    const { trainerRepository, customError } = this;
    
    var Query: string = ""; 

    if(maxDistance != -1){
      Query += " Match (node)-[:LIVES]->(l:Geometry) WHERE distance(point({ latitude: $userLat, longitude: $userLong }), point({ latitude: l.lat, longitude: l.lon })) < $maxDistance";
    }

    if(maxPrice != -1){
      Query += " Match (node) WHERE node.startPrice <= $maxPrice";
    }
     
    if(category != ""){
      Query += " Match (node)-[:OFTYPE]->( c:Category{ name:$category } )";
    }

    if(minRating != -1){
      Query += " Match (node)  WHERE node.fcRating >= $minRating";
    }

    if(gender != ""){
      Query += " Match (node)  WHERE node.gender = $gender";
    }
    
    if(age != -1){
      Query += " Match (node) WHERE node.age <= $age";
    }

    const result = await this.trainerRepository.search(
      userLat,
      userLong,
      maxDistance,
      maxPrice,
      category,
      minRating,
      gender,
      age,
      keyword,
      sortBy,
      order,
      Query 
    );

    return result;
  }
}
