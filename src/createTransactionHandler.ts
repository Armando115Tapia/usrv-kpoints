import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const createTransaction = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("event.body: ", event.body);
    console.log("event.body: ", JSON.stringify(event.body));

    const command = new PutCommand({
        TableName: "qa-usrv-kpoints-card-transactions",
        Item: {
            transaction_id: "testATC",
            country: "Ecuador"
        },
    });

    const response = await docClient.send(command);
    console.log(response);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                response
            },
            null,
            2,
        ),
    };
};
