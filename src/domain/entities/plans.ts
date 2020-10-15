export class Plan {
  readonly plan_id: string;
  readonly title: string;
  readonly type: string;
  readonly price: number;

  constructor({
    plan_id,
    title,
    type,
    price,
  }: {
    plan_id: string;
    title: string;
    type: string;
    price: number;
  }) {
    this.plan_id = plan_id;
    this.price = price;
    this.type = type;
    this.title = title;
  }
}
