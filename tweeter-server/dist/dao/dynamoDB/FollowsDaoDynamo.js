"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsDaoDynamo = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const DataPage_1 = require("../../model/DataPage");
class ConditionalCheckFailedException extends Error {
    constructor(message) {
        super(message);
        this.name = "ConditionalCheckFailedException";
    }
}
class FollowsDaoDynamo {
    tableName = "follows";
    indexName = "followee_handle-follower_handle-index";
    followerHandleAttr = "follower_handle";
    // readonly followerNameAttr = "follower_name";
    followeeHandleAttr = "followee_handle";
    // readonly followeeNameAttr = "followee_name";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async getMoreFollowers(userAlias, pageSize, lastAlias) {
        return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followeeHandleAttr, true);
    }
    async getMoreFollowees(userAlias, pageSize, lastAlias) {
        return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followerHandleAttr, false);
    }
    async putFollow(followerAlias, followeeAlias) {
        const params = {
            TableName: this.tableName,
            Item: this.generateFollowItem(followerAlias, followeeAlias),
            ConditionExpression: "attribute_not_exists(follower_handle) AND attribute_not_exists(followee_handle)"
        };
        try {
            await this.client.send(new lib_dynamodb_1.PutCommand(params));
        }
        catch (error) {
            if (error instanceof ConditionalCheckFailedException) {
                return false;
            }
            throw error;
        }
        return true;
    }
    async deleteFollow(followerAlias, followeeAlias) {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(followerAlias, followeeAlias),
            ConditionExpression: "attribute_exists(follower_handle) AND attribute_exists(followee_handle)"
        };
        try {
            await this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        }
        catch (error) {
            if (error instanceof ConditionalCheckFailedException) {
                return false;
            }
            throw error;
        }
        return true;
    }
    async getFollowingStatus(followerAlias, followeeAlias) {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(followerAlias, followeeAlias)
        };
        const data = await this.client.send(new lib_dynamodb_1.GetCommand(params));
        return data.Item !== undefined;
    }
    async getMoreFollows(userAlias, pageSize, lastAlias, attributeName, useIndex) {
        let sortKeyAttribute;
        if (attributeName === this.followerHandleAttr) {
            sortKeyAttribute = this.followeeHandleAttr;
        }
        else {
            sortKeyAttribute = this.followerHandleAttr;
        }
        const params = {
            KeyConditionExpression: attributeName + " = :userAlias",
            ExpressionAttributeValues: {
                ":userAlias": userAlias,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey: lastAlias === null
                ? undefined
                : {
                    [this.followerHandleAttr]: lastAlias,
                    [this.followeeHandleAttr]: userAlias,
                },
        };
        if (useIndex) {
            params.IndexName = this.indexName;
        }
        const aliases = [];
        const data = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) => aliases.push(item[sortKeyAttribute]));
        return new DataPage_1.DataPage(aliases, hasMorePages);
    }
    generateFollowItem(followerAlias, followeeAlias) {
        return {
            [this.followerHandleAttr]: followerAlias,
            [this.followeeHandleAttr]: followeeAlias
        };
    }
}
exports.FollowsDaoDynamo = FollowsDaoDynamo;
