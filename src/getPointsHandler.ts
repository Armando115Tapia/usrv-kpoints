import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { defaultTo, get } from "lodash";
import { v4 } from "uuid";


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getPoints = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const path_param = event.queryStringParameters;
    const transaction_id = get(path_param, "transaction_id", "");
    console.log("USRV KUSHKI_POINTS: transaction_id", transaction_id)

    const command = new GetCommand({
        // TODO: Cambiar nombre de la tabla a la de account
        TableName: "qa-usrv-kpoints-card-transactions",
        Key: {
            transaction_id: transaction_id
        }
    });

    const response = await docClient.send(command);
    console.log("USRV KUSHKI_POINTS: response", response)
    console.log(response);


    return {
        statusCode: 200,
        body: JSON.stringify(
                get(response, "Item")
        ),
    };
};
