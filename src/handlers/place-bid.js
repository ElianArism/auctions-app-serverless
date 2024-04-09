import createHttpError from "http-errors";
import { ApiMiddleware, DynamoDB } from "../services";

export async function placeBid(event, context) {
  try {
    const { amount } = event.body;
    const db = new DynamoDB();
    const { Item: auction } = await db.getAuctionById(
      process.env.AUCTIONS_TABLE_NAME,
      event.pathParameters.id
    );

    if (!auction) {
      return createHttpError.NotFound(
        `Auction with id ${id} does not exist`
      );
    } else if (auction.highestBid.amount <= amount) {
      throw new createHttpError.Forbidden(
        "Your bid must be higher than $" + auction.highestBid.amount
      );
    }

    const params = {
      UpdateExpression: "set highestBid.amount = :amount",
      ExpressionAttributeValues: { ":amount": amount },
    };

    const result = await db.update(
      process.env.AUCTIONS_TABLE_NAME,
      event.pathParameters.id,
      params
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return createHttpError.InternalServerError(error);
  }
}

export const handler = ApiMiddleware.use(placeBid);
