import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { defaultTo, get } from "lodash";
import { v4 } from "uuid";


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getPoints = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const path_param = event.queryStringParameters;
    const document_number = get(path_param, "documentNumber", "");
    console.log("USRV KUSHKI_POINTS: documentNumber", document_number)

    const command = new GetCommand({
        TableName: "qa-usrv-kpoints-accounts",
        Key: {
            documentNumber: document_number
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
