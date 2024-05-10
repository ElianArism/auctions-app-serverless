import { DynamoDB as DB } from "aws-sdk";

export class DynamoDB {
  #client;

  constructor() {
    this.#client = new DB.DocumentClient({ region: "us-east-1" });
  }

  put(TableName, Item) {
    return this.#client.put({ TableName, Item }).promise();
  }

  update(
    TableName,
    primaryKey,
    {
      ExpressionAttributeNames = undefined,
      ExpressionAttributeValues,
      UpdateExpression,
    }
  ) {
    return this.#client
      .update({
        TableName,
        Key: { [primaryKey.key]: primaryKey.value },
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        UpdateExpression,
        ReturnValues: "ALL_NEW",
      })
      .promise();
  }

  scan(TableName) {
    return this.#client.scan({ TableName }).promise();
  }

  getItemById(TableName, id) {
    return this.#client.get({ TableName, Key: { id } }).promise();
  }

  async searchByGSI(
    tableName,
    indexName,
    {
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    }
  ) {
    const result = await this.#client
      .query({
        TableName: tableName,
        IndexName: indexName,
        FilterExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      })
      .promise();

    return result.Items;
  }
}
