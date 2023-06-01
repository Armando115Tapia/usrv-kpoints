import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const createTransaction = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("createTransaction")

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "Go Serverless v1.0! Your function executed successfully! Jair",
                input: event,
            },
            null,
            2,
        ),
    };
};
