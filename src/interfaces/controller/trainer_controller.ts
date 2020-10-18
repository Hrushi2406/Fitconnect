import { TrainerRepository } from "../../data_provider/repository/trainer_repository";
import { IDependencies } from "../../application/abstracts/dependencies_interface";
import { SearchUseCase } from "../../application/use_cases/trainer_services/search_use_case";
import db from "../../infrastructure/config/db_config";

export class TrainerController {
  //UseCases
  private searchUseCase: SearchUseCase;
  private trainerRepository: TrainerRepository = new TrainerRepository(db);

  //constructor
  constructor(public dependencies: IDependencies) {
    this.searchUseCase = new SearchUseCase(
      dependencies.trainerRepository,
      dependencies.customError
    );
  }

  async getTrainerProfile({trainer_id}: {trainer_id: string}): Promise<any> {
    try {
      //Get result from search use case
      const result: any = await this.trainerRepository.getTrainerbyId(trainer_id);

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Filter & Sort
  async filterAndSearch({
    userLat,
    userLong,
    maxDistance,
    maxPrice,
    category,
    minRating,
    gender,
    age,
    sortBy,
    order,
    keyword
  }: {
    userLat: number;
    userLong: number;
    maxDistance: number;
    maxPrice: number;
    category: string;
    minRating: number;
    gender: string;
    age: number;
    sortBy: string;
    order: string;
    keyword: string;
  }): Promise<any> {
    try {
      //Get result from search use case
      const result: any = await this.searchUseCase.execute(
        userLat,
        userLong,
        maxDistance,
        maxPrice,
        category,
        minRating,
        gender,
        age,
        sortBy,
        order,
        keyword
      );

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }
}
