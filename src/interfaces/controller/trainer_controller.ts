import { dependencies } from "../../infrastructure/config/dependency_injector";
import { IDependencies } from "../../application/abstracts/dependencies_interface";
import { ITrainer } from "../../domain/entities/trainer";
import { Trainer } from "../../domain/entities/trainer";
import { Plan } from "../../domain/entities/plans";

export class TrainerController {
  //constructor
  constructor(public dependencies: IDependencies) {}

  async getTrainerProfile({
    trainerId,
  }: {
    trainerId: string;
  }): Promise<Trainer> {
    try {
      //Get result from search use case
      const result: any = await dependencies.trainerRepository.getTrainerbyId(
        trainerId
      );

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw(err);
    }
  }

  //Get trainer by planId
  async getTrainerbyPlanId({ planId }: { planId: string }): Promise<Trainer> {
    try {
      //Get result from search use case
      const result: any = await dependencies.trainerRepository.getTrainerbyPlanId(
        planId
      );

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw(err);
    }
  }

  //Get plan by planId
  async getPlanbyId({ planId }: { planId: string }): Promise<Plan | {}> {
    try {
      //Get result from search use case
      const result: any = await dependencies.trainerRepository.getPlanbyId(
        planId
      );

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw(err);
    }
  }

  //Get plans by trainerId
  async getTrainerPlans({ trainerId }: { trainerId: string }): Promise<Plan[]> {
    try {
      //Get result from search use case
      const result = await dependencies.trainerRepository.getTrainerPlans(
        trainerId
      );

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw(err);
    }
  }

  //Get recommended Trainers
  async getTrainerRecommendation({
    userId,
  }: {
    userId: string;
  }): Promise<ITrainer[]> {
    try {
      //Get result from repository
      const result = await dependencies.trainerRepository.recommendTrainers(
        userId
      );

      if (result == null) {
        return [];
      }

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw(err);
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
    keyword,
  }: {
    userLat: number;
    userLong: number;
    maxDistance: number;
    maxPrice: number;
    category: string[];
    minRating: number;
    gender: string;
    age: number;
    sortBy: string;
    order: string;
    keyword: string;
  }): Promise<Trainer[]> {
    try {
      //Get result from search use case
      const result: any = await this.dependencies.trainerRepository.searchTrainers(
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
        order
      );

      //Return the result
      return result;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw(err);
    }
  }
}
