import { Plan } from "../../domain/entities/plans";
import { ITrainer } from "../../domain/entities/trainer"

export interface ITrainerRepository {

    //Get trainer profile
    getTrainerbyId: (trainerId: string) => Promise<ITrainer | null>;

    //Get trainer plans
    getTrainerPlans: (trainerId: string) => Promise<[Plan] | null>;

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
      ) => Promise<[ITrainer] | null>;
  
  }

  