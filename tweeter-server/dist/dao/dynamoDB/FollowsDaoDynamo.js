"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsDaoDynamo = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DataPage_1 = require("../../model/DataPage");
const DynamoDaoFactory_1 = require("./DynamoDaoFactory");
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
    async getMoreFollowers(userAlias, pageSize, lastAlias) {
        return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followeeHandleAttr);
    }
    async getMoreFollowees(userAlias, pageSize, lastAlias) {
        return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followerHandleAttr);
    }
    async putFollow(followerAlias, followeeAlias) {
        const params = {
            TableName: this.tableName,
            Item: this.generateFollowItem(followerAlias, followeeAlias),
            ConditionExpression: "attribute_not_exists(follower_handle) AND attribute_not_exists(followee_handle)"
        };
        try {
            await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.PutCommand(params));
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
            await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.DeleteCommand(params));
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
        const data = await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.GetCommand(params));
        return data.Item !== undefined;
    }
    async getMoreFollows(userAlias, pageSize, lastAlias, attributeName) {
        let sortKeyAttribute;
        let useIndex;
        if (attributeName === this.followerHandleAttr) { // getMoreFollowees
            sortKeyAttribute = this.followeeHandleAttr;
            useIndex = false;
        }
        else { // getMoreFollowers
            sortKeyAttribute = this.followerHandleAttr;
            useIndex = true;
        }
        const params = {
            KeyConditionExpression: attributeName + " = :userAlias",
            ExpressionAttributeValues: {
                ":userAlias": userAlias,
            },
            TableName: this.tableName,
            ScanIndexForward: true,
            ExclusiveStartKey: lastAlias === null
                ? undefined
                : {
                    [attributeName]: userAlias,
                    [sortKeyAttribute]: lastAlias,
                },
        };
        if (useIndex) {
            params.IndexName = this.indexName;
        }
        if (pageSize !== null) {
            params.Limit = pageSize;
        }
        const aliases = [];
        const data = await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.QueryCommand(params));
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
