import createHttpError from "http-errors";
import ENV from "../env";
import { ApiMiddleware, DynamoDB } from "../services";

export async function placeBid(event, context) {
  try {
    const { amount } = event.body;
    const db = new DynamoDB();
    const { Item: auction } = await db.getItemById(
      ENV.AUCTIONS_TABLE_NAME,
      event.pathParameters.id
    );

    if (!auction) {
      return createHttpError.NotFound(
        `Auction with id ${id} does not exist`
      );
    } else if (auction.highestBid.amount >= amount) {
      throw new createHttpError.Forbidden(
        "Your bid must be higher than $" + auction.highestBid.amount
      );
    }

    const params = {
      UpdateExpression: "set highestBid.amount = :amount",
      ExpressionAttributeValues: { ":amount": amount },
    };

    const result = await db.update(
      ENV.AUCTIONS_TABLE_NAME,
      { key: "id", value: event.pathParameters.id },
      params
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: JSON.stringify(error),
    };
  }
}

export const handler = ApiMiddleware.use(placeBid);
