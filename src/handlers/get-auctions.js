import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import ENV from "../env";
import { GET_AUCTIONS_SCHEMA } from "../schemas/get-auctions";
import { ApiMiddleware, DynamoDB } from "../services";

async function getAuctions(event, context) {
  try {
    const { status } = event.queryStringParameters;
    const db = new DynamoDB();

    const result = await db.searchByGSI(
      ENV.AUCTIONS_TABLE_NAME,
      ENV.GSI_STATUS_AND_ENDING_AT,
      {
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": status,
        },
      }
    );

    if (!result.length) {
      return {
        statusCode: 404,
        body: "No items found",
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error, message: error?.message ?? "" }),
    };
  }
}

export const handler = ApiMiddleware.use(getAuctions).use(
  validator({
    eventSchema: transpileSchema(GET_AUCTIONS_SCHEMA, {
      useDefaults: true,
    }),
  })
);
