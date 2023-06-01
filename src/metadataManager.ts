import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class MetadataManager {
  public putDynamoTable = async (item: object, tableName: string) => {
    console.log("putDynamoTable was called");

    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    return await docClient.send(command);
  };
}

