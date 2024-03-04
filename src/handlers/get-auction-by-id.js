import createHttpError from "http-errors";
import { ApiMiddleware, DynamoDB } from "../services";

export async function getAuctionById(event, context) {
  try {
    const db = new DynamoDB();
    const result = await db.getAuctionById(
      process.env.AUCTIONS_TABLE_NAME,
      event.pathParameters.id
    );
    if (!result.Item) {
      return createHttpError.NotFound(
        `Item with id ${id} does not exist`
      );
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return createHttpError.InternalServerError(error);
  }
}

export const handler = ApiMiddleware.use(getAuctionById);
