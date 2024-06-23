export class S3Service {
  static async uploadFile(file, { bucketName, client, fileName }) {
    const buffer = Buffer.from(file, "base64");

    const result = await client
      .upload({
        Bucket: bucketName,
        Body: buffer,
        Key: fileName,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      })
      .promise();

    return result.Location;
  }
}
