import ENV from "../env";
import { DynamoDB } from "./dynamo-db";

export const getEndedAuctions = async () => {
  try {
    const db = new DynamoDB();
    const now = new Date();
    const result = await db.searchByGSI(
      ENV.AUCTIONS_TABLE_NAME,
      "STATUS_AND_ENDING_AT",
      {
        FilterExpression:
          "#status = :status AND endingAt <= :endingAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": "OPEN",
          ":endingAt": now.toISOString(),
        },
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
