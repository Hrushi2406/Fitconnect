import { Plan } from "../../domain/entities/plans";
import { ITrainer } from "../../domain/entities/trainer"

export interface ITrainerRepository {

    //Get trainer profile
    getTrainerbyId: (trainerId: string) => Promise<ITrainer | null>;

    //Get trainer profile by planId
    getTrainerbyPlanId: (planId: string) => Promise<ITrainer | null>;

    //Get plan by planId
    getPlanbyId: (planId: string) => Promise<Plan | null>;

    //Get trainer plans
    getTrainerPlans: (trainerId: string) => Promise<[Plan] | null>;

    //Get trainers recommended to userId by his interests
    recommendTrainers: (userId: string) => Promise<[ITrainer] | null>;

    //Full text search & execute the query
    searchTrainers: (
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
      ) => Promise<[ITrainer] | null>;
  
  }

  