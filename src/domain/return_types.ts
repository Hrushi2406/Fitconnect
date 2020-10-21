import { Plan } from "./entities/plans";
import { Trainer } from "./entities/trainer";
import User from "./entities/user";
import Friendship from "./relations/friendship";
import Subscription from "./relations/subscription";

class MyTrainer {
    readonly plan: Plan;
    readonly trainer: Trainer;
    readonly sub: Subscription;
  
    constructor({
      plan,
      trainer,
      sub,
    }: {
        plan: Plan,
        trainer: Trainer,
        sub: Subscription
    }) {
      this.plan = plan;
      this.trainer = trainer;
      this.sub = sub;
    }
}
  
class MyPayment {
    readonly plan: Plan;
    readonly trainer: Trainer;
    readonly partner: User;
    readonly friendship: Friendship;
  
    constructor({
      plan,
      trainer,
      partner,
      friendship,
    }: {
        plan: Plan,
        trainer: Trainer,
        partner: User,
        friendship: Friendship,
    }) {
      this.plan = plan;
      this.trainer = trainer;
      this.partner = partner;
      this.friendship = friendship;
    }
}
  
export{
    MyTrainer,
    MyPayment
}