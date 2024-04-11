import createError from "http-errors";
import ENV from "../env";
import { ApiMiddleware, DynamoDB, IdGenerator } from "../services";

/**
 *
 * @param {*} event: event details such as dto, headers, etc
 * @param {*} context: lambda execution context
 * @returns auctionId
 */
async function createAuction(event, context) {
  const { title } = event.body;
  const createdAt = new Date();
  const endingAt = new Date();
  endingAt.setHours(createdAt.getHours + 1);

  const auctionDTO = {
    id: IdGenerator.generate(),
    title,
    status: "OPEN",
    createdAt: createdAt.toISOString(),
    endingAt: endingAt.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    const db = new DynamoDB();
    await db.put(ENV.AUCTIONS_TABLE_NAME, auctionDTO);

    return {
      statusCode: 200,
      body: JSON.stringify({ auctionId: auctionDTO.id }),
    };
  } catch (error) {
    return createError.InternalServerError(error);
  }
}

export const handler = ApiMiddleware.use(createAuction);
