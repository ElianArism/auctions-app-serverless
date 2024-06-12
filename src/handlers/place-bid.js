import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import createHttpError from "http-errors";
import { AUCTION_STATUSES } from "../enums/auction-statuses";
import ENV from "../env";
import { PLACE_BID_SCHEMA } from "../schemas";
import { ApiMiddleware, DynamoDB } from "../services";

export async function placeBid(event, context) {
  try {
    const { amount } = event.body;
    const { claims: userData } = event.requestContext.authorizer;

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
    } else if (auction.status === AUCTION_STATUSES.CLOSED)
      throw new createHttpError.Forbidden(
        "You cannot bid on closed auctions"
      );

    const params = {
      UpdateExpression:
        "set highestBid.amount = :amount, highestBid.bidder = :bidder",
      ExpressionAttributeValues: {
        ":amount": amount,
        ":bidder": {
          username: userData.nickname,
          email: userData.email,
        },
      },
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

export const handler = ApiMiddleware.use(placeBid).use(
  validator({ eventSchema: transpileSchema(PLACE_BID_SCHEMA) })
);
