export default class Subscription {
    readonly price: string;
    readonly startDate: Date;
    readonly endDate: Date;
  
    constructor({
      price,
      startDate,
      endDate,
    }: {
        price: string;
        startDate: Date;
        endDate: Date;
    }) {
      this.price = price;
      this.startDate = startDate;
      this.endDate = endDate;
    }
}
  