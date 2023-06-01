import { APIGatewayProxyResult, DynamoDBStreamEvent } from "aws-lambda";
import { AttributeValue, DynamoDBRecord } from "aws-lambda/trigger/dynamodb-stream";
import { get, isNaN } from "lodash";
import { MetadataManager} from './metadataManager'
const AWS = require("aws-sdk");
const metadataManager = new MetadataManager();
export const processKPoints = async (event: DynamoDBStreamEvent): Promise<APIGatewayProxyResult> => {
  console.log("processKPoints, was called");

  const record: DynamoDBRecord = event.Records[0];

  if (["INSERT"].includes(record.eventName || "") && record.dynamodb?.NewImage) {
    const newImage: { [key: string]: AttributeValue } = record.dynamodb?.NewImage;
    const newImageAsJson = AWS.DynamoDB.Converter.unmarshall(newImage);
    const amount = get(newImageAsJson, "amount", {});
    const subtotalIva = get(amount, "subtotalIva0", 0);
    const kPoints = buildKPointsValues(subtotalIva);
    const dataToSave = buildDataSoSave(newImageAsJson.contact_details, newImageAsJson.country, kPoints);
    await metadataManager.putDynamoTable(dataToSave, `${process.env.KPOINTS_ACCOUNTS_TABLE}`);

  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      response: true,
    }),
  };
};

const buildKPointsValues = (amount: number): number => {
  console.log({ amount });
  const calculate = Number((1.5 / 100) * amount);
  console.log({ calculate });

  return isNaN(calculate) ? 0 : Math.floor(calculate);
};
const buildDataSoSave = (contactDetails: IUserDetails, country: string, kPoints: number) => {

  return { ...contactDetails, country, kPoints, created: Date.now() };
};

export interface IUserDetails {
  documentNumber: string;
  documentType: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
