"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsDaoDynamo = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const DataPage_1 = require("../../model/DataPage");
class FollowsDaoDynamo {
    tableName = "follows";
    indexName = "follows_index";
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
            Item: this.generateFollowItem(followerAlias, followeeAlias)
        };
        await this.client.send(new lib_dynamodb_1.PutCommand(params));
    }
    async deleteFollow(followerAlias, followeeAlias) {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(followerAlias, followeeAlias)
        };
        await this.client.send(new lib_dynamodb_1.DeleteCommand(params));
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
        data.Items?.forEach((item) => aliases.push(item[this.followerHandleAttr]));
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
