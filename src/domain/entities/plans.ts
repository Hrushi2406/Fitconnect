export class Plan {
  readonly planId: string;
  readonly title: string;
  readonly type: string;
  readonly price: number;

  constructor({
    planId,
    title,
    type,
    price,
  }: {
    planId: string;
    title: string;
    type: string;
    price: number;
  }) {
    this.planId = planId;
    this.price = price;
    this.type = type;
    this.title = title;
  }
}
