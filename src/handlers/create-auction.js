import { DynamoDB, IdGenerator } from "../services";

/**
 *
 * @param {*} event: event details such as dto, headers, etc
 * @param {*} context: lambda execution context
 * @returns auctionId
 */
async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);

  const auctionDTO = {
    id: IdGenerator.generate(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  try {
    const db = new DynamoDB();
    await db.put("AuctionsTable", auctionDTO);

    return {
      statusCode: 200,
      body: JSON.stringify({ auctionId: auctionDTO.id }),
    };
  } catch (error) {
    return {
      statusCode: error.status ?? 500,
      body: JSON.stringify(error),
    };
  }
}

export const handler = createAuction;
