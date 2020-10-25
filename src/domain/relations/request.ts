import { IUser } from "./../../application/abstracts/user_repository_interface";
import { Plan } from "neo4j-driver";
import { ITrainer } from "../entities/trainer";

export default class Request {
  readonly sender: IUser;
  readonly receiverId: string;
  readonly forPlan: Plan;
  readonly trainer: ITrainer;

  constructor({
    sender,
    receiverId,
    forPlan,
    trainer,
  }: {
    sender: IUser;
    receiverId: string;
    forPlan: Plan;
    trainer: ITrainer;
  }) {
    this.sender = sender;
    this.receiverId = receiverId;
    this.forPlan = forPlan;
    this.trainer = trainer;
  }
}
