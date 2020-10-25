import { Plan } from "./entities/plans";
import { Trainer } from "./entities/trainer";
import User from "./entities/user";
import Friendship from "./relations/friendship";
import Subscription from "./relations/subscription";

class MyTrainer {
  readonly forPlan: Plan;
  readonly trainer: Trainer;
  readonly sub: Subscription;

  constructor({
    forPlan,
    trainer,
    sub,
  }: {
    forPlan: Plan;
    trainer: Trainer;
    sub: Subscription;
  }) {
    this.forPlan = forPlan;
    this.trainer = trainer;
    this.sub = sub;
  }
}

class MyPayment {
  readonly forPlan: Plan;
  readonly trainer: Trainer;
  readonly partner: User;
  readonly friendship: Friendship;

  constructor({
    forPlan,
    trainer,
    partner,
    friendship,
  }: {
    forPlan: Plan;
    trainer: Trainer;
    partner: User;
    friendship: Friendship;
  }) {
    this.forPlan = forPlan;
    this.trainer = trainer;
    this.partner = partner;
    this.friendship = friendship;
  }
}

export { MyTrainer, MyPayment };
