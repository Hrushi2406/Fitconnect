import { IIDGenerator } from "src/application/abstracts/id_generator_interface";
import { v4 as uuidv4 } from "uuid";

export class IDGenerator implements IIDGenerator {
  //Default constructor
  constructor() {}

  //Generates a unique ID
  generate = (): string => uuidv4();
}
