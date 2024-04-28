import AWS from "aws-sdk";

export class DynamoDB {
  #client;

  constructor() {
    this.#client = new AWS.DynamoDB.DocumentClient();
  }

  put(TableName, Item) {
    return this.#client.put({ TableName, Item }).promise();
  }

  scan(TableName) {
    return this.#client.scan({ TableName }).promise();
  }

  getItemById(TableName, id) {
    return this.#client.get({ TableName, Key: { id } }).promise();
  }

  update(TableName, id, params) {
    return this.#client
      .update({
        ...params,
        TableName,
        Key: { id },
        ReturnValues: "ALL_NEW",
      })
      .promise();
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
