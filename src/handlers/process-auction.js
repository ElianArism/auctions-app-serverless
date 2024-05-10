import createHttpError from "http-errors";
import ENV from "../env";
import { DynamoDB, getEndedAuctions } from "../services";

async function processAuction(command, ctx) {
  try {
    const db = new DynamoDB();
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
    console.log(results);
    return {
      closedAuctions: results.length,
    };
  } catch (error) {
    console.log(error);
    throw new createHttpError.InternalServerError(error);
  }
}

export const handler = processAuction;
