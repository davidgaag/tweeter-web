"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDaoDynamo = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class UserDaoDynamo {
    tableName = "user";
    firstNameAttr = "firstName";
    lastNameAttr = "lastName";
    aliasAttr = "alias";
    passwordAttr = "password";
    imageUrlAtrr = "imageUrl";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async getUserByAlias(alias) {
        const params = {
            TableName: this.tableName,
            Key: this.generateUserKey(alias)
        };
        const output = await this.client.send(new lib_dynamodb_1.GetCommand(params));
        return output.Item == undefined
            ? undefined
            : [new tweeter_shared_1.User(output.Item[this.firstNameAttr], output.Item[this.lastNameAttr], output.Item[this.aliasAttr], output.Item[this.imageUrlAtrr]),
                output.Item[this.passwordAttr]];
    }
    async putUser(firstName, lastName, alias, imageUrl, hashedPassword) {
        const params = {
            TableName: this.tableName,
            Item: this.generateUserItem(firstName, lastName, alias, imageUrl, hashedPassword)
        };
        await this.client.send(new lib_dynamodb_1.PutCommand(params));
    }
    generateUserItem(firstName, lastName, alias, imageUrl, hashedPassword) {
        return {
            firstName: firstName,
            lastName: lastName,
            alias: alias,
            imageUrl: imageUrl,
            password: hashedPassword
        };
    }
    generateUserKey(alias) {
        return {
            alias: alias
        };
    }
}
exports.UserDaoDynamo = UserDaoDynamo;
