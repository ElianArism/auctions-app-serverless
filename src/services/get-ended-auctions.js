import { AUCTION_STATUSES } from "../enums/auction-statuses";
import ENV from "../env";
import { DynamoDB } from "./dynamo-db";

export const getEndedAuctions = async () => {
  try {
    const db = new DynamoDB();
    const now = new Date();
    const result = await db.searchByGSI(
      ENV.AUCTIONS_TABLE_NAME,
      ENV.GSI_STATUS_AND_ENDING_AT,
      {
        KeyConditionExpression:
          "#status = :status AND endingAt <= :endingAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": AUCTION_STATUSES.OPEN,
          ":endingAt": now.toISOString(),
        },
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
