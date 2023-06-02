import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { defaultTo, get, isEmpty, set } from "lodash";
import { v4 } from "uuid";
import { MetadataManager } from "./metadataManager";

const metadataManager = new MetadataManager();

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const discountPoints = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const discountPointsBody = JSON.parse(defaultTo(get(event,"body"), "{}"));
    const docuementNumber = get(discountPointsBody, "documentNumber", "");
    const kPointsInformation = await metadataManager.getDynamoTableItem(`${process.env.KPOINTS_ACCOUNTS_TABLE}`, {
        documentNumber: docuementNumber,
    });
    const kPointsFromTable = get(kPointsInformation, "Item.kPoints", []);
    const index = kPointsFromTable.findIndex((merchant: any) => get(merchant, "merchantId")
        === get(discountPointsBody,"merchantId", ""));

    if(index >= 0){
        const objectPoint = kPointsFromTable[index]
        const currentValue = get(objectPoint, "kpoints");
        const resultValue = currentValue - get(discountPointsBody,"discountPoints", 0);
        const newValue = isNaN(resultValue) || resultValue < 0 ? 0 : resultValue;
        kPointsFromTable[index] = {
            ...objectPoint,
            kpoints: newValue
        }
        const dataToSave = buildDataSoSaveDisccount(
            get(kPointsInformation, "Item"),
            kPointsFromTable);
        await metadataManager.putDynamoTable(dataToSave, `${process.env.KPOINTS_ACCOUNTS_TABLE}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                response: true,
            }),
        };

    }else {
        return {
            statusCode: 400,
            body: JSON.stringify(
                {"error":"La información proporcioada es incorrecta"}
            ),
        };

    }
};

const buildDataSoSaveDisccount = (kPointsInformation: any, kPoints: []) => {
    return { ...kPointsInformation, kPoints, updated: Date.now() };
};
