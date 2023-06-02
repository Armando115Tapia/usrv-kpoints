import { APIGatewayProxyResult, DynamoDBStreamEvent } from "aws-lambda";
import { AttributeValue, DynamoDBRecord } from "aws-lambda/trigger/dynamodb-stream";
import { get, isNaN } from "lodash";
import { MetadataManager } from "./metadataManager";
const AWS = require("aws-sdk");
const metadataManager = new MetadataManager();
export const processKPoints = async (event: DynamoDBStreamEvent): Promise<APIGatewayProxyResult> => {
  console.log("processKPoints, was called");

  const record: DynamoDBRecord = event.Records[0];
  const newImage: { [key: string]: AttributeValue } | undefined = record.dynamodb?.NewImage;
  const newImageAsObject = AWS.DynamoDB.Converter.unmarshall(newImage);
  if (isPossibleAddPoints(record, newImageAsObject)) {
    const subtotalIva = get(newImageAsObject, "amount.subtotalIva0", 0);
    const kPointsEarned = buildKPointsValues(subtotalIva);
    const kPointsInformation = await metadataManager.getDynamoTableItem(`${process.env.KPOINTS_ACCOUNTS_TABLE}`, {
      documentNumber: newImageAsObject.contact_details.documentNumber,
    });
    const kPointsFromTable = get(kPointsInformation, "Item.kPoints", 0);
    const dataToSave = buildDataSoSave(
      newImageAsObject.contact_details,
      newImageAsObject.country,
      kPointsFromTable + kPointsEarned,
    );
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

const isPossibleAddPoints = (record: DynamoDBRecord, newImage: object): boolean => {
  const transactionStatus = get(newImage, "transaction_status");
  const transactionType = get(newImage, "transaction_type");
  console.log({transactionStatus, transactionType})
  return ["INSERT"].includes(record.eventName || "") &&
      ["SALE", "DEFFERED"].includes(transactionType || "") &&
      transactionStatus === "APPROVAL";

};

export interface IUserDetails {
  documentNumber: string;
  documentType: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
