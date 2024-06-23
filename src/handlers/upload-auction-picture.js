import AWS from "aws-sdk";
import createHttpError from "http-errors";
import ENV from "../env";
import { UpdatePictureLib } from "../libs";
import { UPLOAD_AUCTION_PICTURE_SCHEMA } from "../schemas";
import { ApiMiddleware } from "../services";
import { DynamoDB } from "../services/dynamo-db";

const db = new DynamoDB();
const s3 = new AWS.S3({ region: ENV.REGION });

async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters;
  const { claims: userData } = event.requestContext.authorizer;

  try {
    const auction = await UpdatePictureLib.getAuction(id, {
      client: db,
    });

    // verify if user is the auction's owner
    UpdatePictureLib.verifySeller(userData, auction);

    const imgUrl = await UpdatePictureLib.uploadPicture(event, {
      client: s3,
      fileName: id + ".jpg",
    });

    const updatedAuction =
      await UpdatePictureLib.updateAuctionPicture(id, imgUrl, client);

    return {
      statusCode: 200,
      body: JSON.stringify({ auction: updatedAuction }),
    };
  } catch (error) {
    if (
      error instanceof createHttpError.Unauthorized ||
      error instanceof createHttpError.NotFound ||
      error instanceof createHttpError.InternalServerError
    ) {
      throw error;
    }
    throw new createHttpError.InternalServerError(error);
  }
}

export const handler = ApiMiddleware.use(uploadAuctionPicture).use(
  validator({
    eventSchema: transpileSchema(UPLOAD_AUCTION_PICTURE_SCHEMA, {
      useDefaults: true,
    }),
  })
);
