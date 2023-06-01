import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { defaultTo, get } from "lodash";
import { v4 } from "uuid";


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const createTransaction = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const transactionBody: object = <object>defaultTo(get(event,"body"), {})

    const command = new PutCommand({
        TableName: "qa-usrv-kpoints-card-transactions",
        Item: {
            transaction_id: v4(),
            ...transactionBody
        },
    });

    const response = await docClient.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                response
            }
        ),
    };
};
