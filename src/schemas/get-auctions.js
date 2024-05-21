import { AUCTION_STATUSES } from "../enums/auction-statuses";

export const GET_AUCTIONS_SCHEMA = {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: [AUCTION_STATUSES.OPEN, AUCTION_STATUSES.CLOSED],
          default: AUCTION_STATUSES.OPEN,
        },
      },
      required: ["status"],
    },
  },
  required: ["queryStringParameters"],
};
