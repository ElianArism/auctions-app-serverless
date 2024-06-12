import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import { AUCTION_STATUSES } from "../enums/auction-statuses";
import { CREATE_AUCTION_SCHEMA } from "../schemas/create-auction";
import { ApiMiddleware, DynamoDB, IdGenerator } from "../services";

/**
 *
 * @param {*} event: event details such as dto, headers, etc
 * @param {*} context: lambda execution context
 * @returns auctionId
 */
async function createAuction(event, context) {
  const { title } = event.body;
  const { claims: userData } = event.requestContext.authorizer;
  const createdAt = new Date();
  const endingAt = new Date();
  endingAt.setHours(createdAt.getHours() + 1);

  const auctionDTO = {
    id: IdGenerator.generate(),
    title,
    status: AUCTION_STATUSES.OPEN,
    createdAt: createdAt.toISOString(),
    endingAt: endingAt.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: {
      email: userData.email,
      username: userData.nickname,
    },
  };

  try {
    const db = new DynamoDB();
    let tableName = process.env.AUCTIONS_TABLE_NAME;
    await db.put(tableName, auctionDTO);

    return {
      statusCode: 200,
      body: JSON.stringify({ auctionId: auctionDTO.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
}

export const handler = ApiMiddleware.use(createAuction).use(
  validator({ eventSchema: transpileSchema(CREATE_AUCTION_SCHEMA) })
);
