import { APIGatewayProxyResult, DynamoDBStreamEvent } from "aws-lambda";

export const processKPoints = async (event: DynamoDBStreamEvent): Promise<APIGatewayProxyResult> => {
    console.log("processKPoints, was called");
    console.log({ event });

    const body: object = event.Records

    console.log({body});

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
