"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenDaoDynamo = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDaoFactory_1 = require("./DynamoDaoFactory");
class AuthTokenDaoDynamo {
    tableName = "authToken";
    tokenAttr = "token";
    aliasAttr = "alias";
    createdAtAttr = "createdAt";
    expirationAttr = "expiration";
    async putAuthToken(token, alias) {
        const params = {
            TableName: this.tableName,
            Item: this.generateAuthTokenItem(token, alias)
        };
        await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.PutCommand(params));
    }
    // public async checkAuthToken(token: AuthToken): Promise<boolean> {
    //    const params = {
    //       TableName: this.tableName,
    //       Key: this.generateAuthTokenKey(token.token)
    //    };
    //    const output = await client.send(new GetCommand(params));
    //    return output.Item != undefined;
    // }
    // TODO: Is this necessary?
    async getAssociatedAlias(token) {
        const params = {
            TableName: this.tableName,
            Key: this.generateAuthTokenKey(token.token)
        };
        const output = await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.GetCommand(params));
        return output.Item == undefined ? undefined : output.Item[this.aliasAttr];
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
        await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.UpdateCommand(params));
    }
    async deleteAuthToken(token) {
        const params = {
            TableName: this.tableName,
            Key: this.generateAuthTokenKey(token.token)
        };
        await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.DeleteCommand(params));
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
        return Math.floor((0, DynamoDaoFactory_1.createTimeStamp)() + 60 * 60);
    }
}
exports.AuthTokenDaoDynamo = AuthTokenDaoDynamo;
