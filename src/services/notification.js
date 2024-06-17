import { SQS } from "aws-sdk";
import ENV from "../env";

export class NotificationService {
  #client;
  constructor(client = new SQS()) {
    this.#client = client;
  }

  async send(
    { subject, destinations, message } = {
      subject,
      destinations,
      message,
    }
  ) {
    try {
      await this.#client
        .sendMessage({
          MessageBody: JSON.stringify({
            subject,
            destinations,
            message,
          }),
          QueueUrl: ENV.MAIL_QUEUE_URL,
        })
        .promise();
    } catch (error) {
      console.log(error);
      throw new Error(
        ` Error sending message to queue ${ENV.MAIL_QUEUE_URL}`
      );
    }
  }
}
