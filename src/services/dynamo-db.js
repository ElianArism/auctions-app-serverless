import AWS from "aws-sdk";

export class DynamoDB {
  #client;

  constructor() {
    this.#client = new AWS.DynamoDB.DocumentClient();
  }

  put(TableName, Item) {
    return this.#client.put({ TableName, Item }).promise();
  }
}
