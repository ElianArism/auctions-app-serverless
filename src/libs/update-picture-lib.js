import createHttpError from "http-errors";
import ENV from "../env";
import { S3Service } from "../services";

export class UpdatePictureLib {
  static async getAuction(id, { client }) {
    const { Item: auction } = await client.getItemById(
      ENV.AUCTIONS_TABLE_NAME,
      id
    );

    if (!auction) {
      throw new createHttpError.NotFound(
        "Not found auction with id " + id
      );
    }

    return auction;
  }
  static verifySeller(userData, auction) {
    if (userData.email !== auction.seller.email) {
      throw new createHttpError.Unauthorized(
        "You are not allowed to upload an image for the auction with id: " +
          id
      );
    }
  }

  static async uploadPicture(event, { client, fileName }) {
    // delete base 64 img prefix from an img coded in base 64 format
    const imgBase64 = event.body.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const imgUrl = await S3Service.uploadFile(imgBase64, {
      bucketName: ENV.AUCTIONS_BUCKET_NAME,
      client,
      fileName,
    });

    return imgUrl;
  }

  static async updateAuctionPicture(id, imgUrl, client) {
    const { Attributes: updatedAuction } = await client.update(
      ENV.AUCTIONS_TABLE_NAME,
      { key: "id", value: id },
      {
        ExpressionAttributeValues: {
          ":picture": imgUrl,
        },
        UpdateExpression: "set picture = :picture",
      }
    );

    return updatedAuction;
  }
}
