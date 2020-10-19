import { dependencies } from "../../infrastructure/config/dependency_injector";
import { IDependencies } from "../../application/abstracts/dependencies_interface";
import { SearchUseCase } from "../../application/use_cases/trainer_services/search_use_case"; 
import { Trainer } from "../../domain/entities/trainer";
import { Plan } from "../../domain/entities/plans";

export class TrainerController {
  //UseCases
  private searchUseCase: SearchUseCase;

  //constructor
  constructor(public dependencies: IDependencies) {
    this.searchUseCase = new SearchUseCase(
      dependencies.trainerRepository,
      dependencies.customError
    );
  }

  async getTrainerProfile({trainerId}: {trainerId: string}): Promise<Trainer | null> {
    try {
      //Get result from search use case
      const result: any = await dependencies.trainerRepository.getTrainerbyId(trainerId);

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Get plans by trainerId
  async getTrainerPlans({trainerId}: {trainerId: string}): Promise<[Plan] | null> {
    try {
      //Get result from search use case
      const result: [Plan] | null = await dependencies.trainerRepository.getTrainerPlans(trainerId);

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
  }): Promise<[Trainer] | null> {
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
