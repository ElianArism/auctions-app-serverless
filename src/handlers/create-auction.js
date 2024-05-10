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
  endingAt.setHours(createdAt.getHours() + 1);

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
    console.log("SE EJECUTA CREATE AUCTION");
    const db = new DynamoDB();
    let tableName = process.env.AUCTIONS_TABLE_NAME;
    await db.put(tableName, auctionDTO);

    return {
      statusCode: 200,
      body: JSON.stringify({ auctionId: auctionDTO.id }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
}

export const handler = ApiMiddleware.use(createAuction);
