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
      Query = this.trainerRepository.distanceFilter(Query);
    }

    if(maxPrice != -1){
      Query = this.trainerRepository.priceFilter(Query);
    }
     
    if(category != ""){
      Query = this.trainerRepository.categoryFilter(Query);
    }

    if(minRating != -1){
      Query = this.trainerRepository.ratingFilter(Query);
    }

    if(gender != ""){
      Query = this.trainerRepository.genderFilter(Query);
    }
    
    if(age != -1){
      Query = this.trainerRepository.ageFilter(Query);
    }

    const result = await this.trainerRepository.execute(
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
