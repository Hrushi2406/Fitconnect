export default class Friendship {
  readonly planId: string;
  readonly paid: string[];

  constructor({ planId, paid }: { planId: string; paid: string[] }) {
    this.planId = planId;
    this.paid = paid;
  }
}
