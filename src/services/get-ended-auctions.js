import { DynamoDB } from "./dynamo-db";

export const getEndedAuctions = async (event) => {
  try {
    const db = new DynamoDB();
    const now = new Date();
    db.searchByGSI(
      process.env.AUCTIONS_TABLE,
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
  } catch (error) {
    throw error;
  }
};
