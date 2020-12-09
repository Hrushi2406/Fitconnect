import { Plan } from "../../domain/entities/plans";
import { ITrainer } from "../../domain/entities/trainer";

export interface ITrainerRepository {
  //Get trainer profile
  getTrainerbyId: (trainerId: string) => Promise<ITrainer | null>;

  //Get All plans from list of trainerID
  getAllPlansFromTrainerIds(
    trainerIds: readonly string[]
  ): Promise<Map<string, Plan[]>>;

  //Get trainers recommended to userId by his interests
  recommendTrainers: (userId: string) => Promise<ITrainer[]>;

  //Get trainer's rating
  getFcRating: (trainerId: string) => Promise<number>;

  //Full text search & execute the query
  searchTrainers: (
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
  ) => Promise<ITrainer[]>;
}
