import { ITrainer } from "../../domain/entities/trainer"

export interface ITrainerRepository {
    //Filter by max distance
    distanceFilter: (prevQuery: string) => string;
  
    //Filter by starting price
    priceFilter: (prevQuery: string) => string;

    //Filter by category
    categoryFilter: (prevQuery: string) => string;
  
    //Filter by min rating
    ratingFilter: (prevQuery: string) => string;
    
    //Filter by gender
    genderFilter: (prevQuery: string) => string;
  
    //Filter by age
    ageFilter: (prevQuery: string) => string;

    //Full text search & execute the query
    execute: (
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

  