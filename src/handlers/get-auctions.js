import createHttpError from "http-errors";
import ENV from "../env";
import { DynamoDB } from "../services";

export async function getAuctions(event, context) {
  try {
    const db = new DynamoDB();
    const result = await db.scan(ENV.AUCTIONS_TABLE_NAME);
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.log(error);
    return createHttpError.InternalServerError(error);
  }
}

export const handler = getAuctions;
