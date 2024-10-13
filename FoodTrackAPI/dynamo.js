import {ListTablesCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    UpdateCommand,
    PutCommand,
    DynamoDBDocumentClient,
    ScanCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region : "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

export const fetchUsers = async () => {
    const command = new ScanCommand({
        ExpressionAttributeNames: { "#name": "name" },
        ProjectionExpression: "id, #name, completed",
        TableName: "Users"
    });

    const response = await docClient(command);

    return response;
}

export const createUser = async () => {
    const command = new PutCommand({
        TableName: "Users",
        Item: {
            Foods: ["Food"],
        }
    })
}

// export const updateUser = async () => {
//     const command = new 
// }

// export const deleteUser = async () => {
//     const command = new 
// }