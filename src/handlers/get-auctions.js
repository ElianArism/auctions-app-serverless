import createHttpError from "http-errors";
import { ApiMiddleware, DynamoDB } from "../services";

export async function getAuctions(event, context) {
  try {
    const db = new DynamoDB();
    const result = await db.scan(process.env.AUCTIONS_TABLE_NAME);
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return createHttpError.InternalServerError(error);
  }
}

export const handler = ApiMiddleware.use(getAuctions);
