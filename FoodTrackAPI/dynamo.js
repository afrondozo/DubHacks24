import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    UpdateCommand,
    PutCommand,
    DynamoDBDocumentClient,
    ScanCommand,
    GetCommand
} from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({ region : "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true,  // Automatically remove undefined values
    }
});

export const fetchUsers = async () => {
    const command = new ScanCommand({
        // ExpressionAttributeNames: { "#name": "name" },
        ProjectionExpression: "UserID, foods",
        TableName: "Users"
    });

    const response = await docClient.send(command);

    return response;
}

export const getUser = async ( UserID ) => {
    const command = new GetCommand({
        TableName: "Users",  // Replace with your actual table name
        Key: { 
            UserID: UserID
            // UserID 
        },     // The partition key to search by
    });

    const response = await docClient.send(command);

    return response.Item.foods;

};

export const createUser = async ( username ) => {
    const command = new PutCommand({
        TableName: "Users",
        Item: {
            UserID: username,
            foods: [],
        },
    });

    const response = await docClient.send(command);
    
    return response;
}

export const addFoodItem = async ( username, foodItem, expirationDate) => {
    const command = new UpdateCommand({
        TableName: "Users",
        Key: {
            UserID: username
        },
        UpdateExpression: "set foods = list_append(if_not_exists(foods, :emptyList), :newFood)",
        ExpressionAttributeValues: {
            ":newFood": [[foodItem, expirationDate]],  // Add the [foodItem, expirationDate] as a list item (nested in a list to append)
            ":emptyList": []                           // If 'foods' attribute does not exist, initialize it as an empty list
        },
        ReturnValues: "UPDATED_NEW",
    });

    const response = await docClient.send(command);

    return response;
}

export const deleteFoodItem = async ( username, fooditem) => {
    const getCommand = new GetCommand({
        TableName: "Users",
        Key: { 
          UserID: username  // Assuming 'UserId' is the primary key
        },
        ProjectionExpression: "foods"  // Retrieve only the 'foods' attribute
    });
    
    const getResponse = await docClient.send(getCommand);
    
    const existingFoods = getResponse.Item?.foods || [];

    // Step 2: Filter out the foodItem from the foods list
    const updatedFoods = existingFoods.filter(([item, expiration]) => item !== foodItem);

    // Step 3: Update the user with the new foods list (without the deleted foodItem)
    const updateCommand = new UpdateCommand({
      TableName: "Users",
      Key: { 
        UserID: username
      },
      UpdateExpression: "SET foods = :updatedFoods",
      ExpressionAttributeValues: {
        ":updatedFoods": updatedFoods
      },
      ReturnValues: "UPDATED_NEW",  // Return the updated item (after the deletion)
    });

    const updateResponse = await docClient.send(updateCommand);

    return updateResponse;
    
}