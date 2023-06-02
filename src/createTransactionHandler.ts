import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { defaultTo, get } from "lodash";
import { v4 } from "uuid";


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const createTransaction = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const transactionBody = JSON.parse(defaultTo(get(event,"body"), "{}"));
    const transactionItem = {
        transaction_id: v4(),
        ...transactionBody
    }
    console.log("USRV KUSHKI_POINTS: transactionBody", transactionBody)

    const command = new PutCommand({
        TableName: "qa-usrv-kpoints-card-transactions",
        Item: transactionItem,
    });

    const response = await docClient.send(command);
    console.log("USRV KUSHKI_POINTS: response", response)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                transactionItem
            }
        ),
    };
};
