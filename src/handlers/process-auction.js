import { SQS } from "aws-sdk";
import createHttpError from "http-errors";
import ENV from "../env";
import { NotifyAuctionsService } from "../libs";
import {
  DynamoDB,
  NotificationService,
  getEndedAuctions,
} from "../services";

const db = new DynamoDB();
const notificationService = new NotificationService(
  new SQS({ region: ENV.region })
);

async function processAuction(command, ctx) {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closeOperations = auctionsToClose.map((a) =>
      db.update(
        ENV.AUCTIONS_TABLE_NAME,
        { key: "id", value: a.id },
        {
          UpdateExpression: "set #status = :status",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":status": a.status },
        }
      )
    );
    const results = await Promise.all(closeOperations);

    await NotifyAuctionsService.notifyClosedAuctions(
      auctionsToClose,
      notificationService
    );

    return {
      closedAuctions: results.length,
    };
  } catch (error) {
    console.log(error);
    throw new createHttpError.InternalServerError(error);
  }
}

export const handler = processAuction;
