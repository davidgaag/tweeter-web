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
    numFollowersAttr = "numFollowers";
    numFolloweesAttr = "numFollowees";
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
    async getUsersByAlias(aliases) {
        const params = {
            RequestItems: {
                [this.tableName]: {
                    Keys: aliases.map(alias => this.generateUserKey(alias))
                }
            }
        };
        const output = await this.client.send(new lib_dynamodb_1.BatchGetCommand(params));
        return output.Responses == undefined
            ? []
            : output.Responses[this.tableName].map((item) => new tweeter_shared_1.User(item[this.firstNameAttr], item[this.lastNameAttr], item[this.aliasAttr], item[this.imageUrlAtrr]));
    }
    async putUser(firstName, lastName, alias, imageUrl, hashedPassword) {
        const params = {
            TableName: this.tableName,
            Item: this.generateUserItem(firstName, lastName, alias, imageUrl, hashedPassword)
        };
        await this.client.send(new lib_dynamodb_1.PutCommand(params));
    }
    async getNumFollowers(alias) {
        return await this.getFollowCount(alias, this.numFollowersAttr);
    }
    async getNumFollowees(alias) {
        return await this.getFollowCount(alias, this.numFolloweesAttr);
    }
    async incrementFollowers(alias) {
        return await this.incrementFollowCount(alias, this.numFollowersAttr);
    }
    async decrementFollowers(alias) {
        return await this.decrementFollowCount(alias, this.numFollowersAttr);
    }
    async incrementFollowees(alias) {
        return await this.incrementFollowCount(alias, this.numFolloweesAttr);
    }
    async decrementFollowees(alias) {
        return await this.decrementFollowCount(alias, this.numFolloweesAttr);
    }
    async getFollowCount(alias, attribute) {
        const params = {
            TableName: this.tableName,
            Key: this.generateUserKey(alias),
            ProjectionExpression: attribute
        };
        console.log("params:", params);
        const output = await this.client.send(new lib_dynamodb_1.GetCommand(params));
        console.log("output:", output);
        return output.Item == undefined ? undefined : output.Item[attribute];
    }
    async incrementFollowCount(alias, attribute) {
        const params = {
            TableName: this.tableName,
            Key: this.generateUserKey(alias),
            ExpressionAttributeNames: {
                [`#${attribute}`]: attribute // numFollowers or numFollowees
            },
            ExpressionAttributeValues: {
                ":increment": 1
            },
            UpdateExpression: `ADD #${attribute} :increment`,
            ReturnValues: client_dynamodb_1.ReturnValue.UPDATED_NEW
        };
        const output = await this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        return output.Attributes == undefined ? undefined : output.Attributes[attribute];
    }
    async decrementFollowCount(alias, attribute) {
        const params = {
            TableName: this.tableName,
            Key: this.generateUserKey(alias),
            ExpressionAttributeNames: {
                [`#${attribute}`]: attribute // numFollowers or numFollowees
            },
            ExpressionAttributeValues: {
                ":decrement": -1
            },
            UpdateExpression: `ADD #${attribute} :decrement`,
            ReturnValues: client_dynamodb_1.ReturnValue.UPDATED_NEW
        };
        const output = await this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        return output.Attributes == undefined ? undefined : output.Attributes[attribute];
    }
    generateUserItem(firstName, lastName, alias, imageUrl, hashedPassword) {
        return {
            firstName: firstName,
            lastName: lastName,
            alias: alias,
            imageUrl: imageUrl,
            password: hashedPassword,
            numFollowers: 0,
            numFollowees: 0
        };
    }
    generateUserKey(alias) {
        return {
            alias: alias
        };
    }
}
exports.UserDaoDynamo = UserDaoDynamo;
