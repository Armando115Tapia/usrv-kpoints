import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const hello = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Los logs")

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
