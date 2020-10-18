import { ITrainer } from "../../domain/entities/trainer"

export interface ITrainerRepository {

    //Get trainer profile
    getTrainerbyId: (trainer_id: string) => Promise<any>;

    //Full text search & execute the query
    search: (
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
      ) => Promise<any>;
  
  }

  