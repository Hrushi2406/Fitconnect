export default class Request {
    readonly senderId: string;
    readonly receiverId: string;
    readonly planId: string;
  
    constructor({
      senderId,
      receiverId,
      planId,
    }: {
        senderId: string,
        receiverId: string,
        planId: string,
    }) {
      this.senderId = senderId;
      this.receiverId = receiverId
      this.planId = planId;
    }
}
  