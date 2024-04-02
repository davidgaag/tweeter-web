"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenDaoDynamo = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class AuthTokenDaoDynamo {
    tableName = "authToken";
    tokenAttr = "token";
    aliasAttr = "alias";
    createdAtAttr = "createdAt";
    expirationAttr = "expiration";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async putAuthToken(token, alias) {
        const params = {
            TableName: this.tableName,
            Item: this.generateAuthTokenItem(token, alias)
        };
        await this.client.send(new lib_dynamodb_1.PutCommand(params));
    }
    async updateTokenExpiration(token) {
        const params = {
            TableName: this.tableName,
            Key: this.generateAuthTokenKey(token.token),
            UpdateExpression: "SET #expiration = :expiration",
            ExpressionAttributeNames: {
                "#expiration": this.expirationAttr
            },
            ExpressionAttributeValues: {
                ":expiration": this.calculateExpiration()
            }
        };
        await this.client.send(new lib_dynamodb_1.UpdateCommand(params));
    }
    generateAuthTokenItem(token, alias) {
        return {
            token: token.token,
            alias: alias,
            createdAt: Math.floor(token.timestamp / 1000),
            expiration: this.calculateExpiration()
        };
    }
    generateAuthTokenKey(token) {
        return {
            token: token
        };
    }
    calculateExpiration() {
        // Calculate the expiration time (one hour from now) in epoch second format
        return Math.floor((new Date().getTime() / 1000) + 60 * 60);
    }
}
exports.AuthTokenDaoDynamo = AuthTokenDaoDynamo;
