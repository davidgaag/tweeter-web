"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusDaoDynamo = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDaoFactory_1 = require("./DynamoDaoFactory");
const DataPage_1 = require("../../model/DataPage");
class StatusDaoDynamo {
    storyTableName = "story";
    authorAttr = "author";
    feedTableName = "feed";
    feedOwnerAttr = "feedOwner";
    // Shared/common attributes
    contentAttr = "content";
    createdAtAttr = "createdAt";
    async getMoreStoryItems(userAlias, pageSize, lastItem) {
        return await this.getMoreStatuses(this.storyTableName, userAlias, pageSize, lastItem);
    }
    async getMoreFeedItems(userAlias, pageSize, lastItem) {
        return await this.getMoreStatuses(this.feedTableName, userAlias, pageSize, lastItem);
    }
    async putStatusInStory(status) {
        const params = {
            TableName: this.storyTableName,
            Item: this.createStoryItem(status)
        };
        await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.PutCommand(params));
    }
    async putStatusInFeeds(status, followerAliases) {
        const items = followerAliases.map(followerAlias => this.createFeedItem(status, followerAlias));
        for (let i = 0; i < items.length; i += 25) {
            const params = {
                RequestItems: {
                    [this.feedTableName]: items.slice(i, i + 25).map(item => ({
                        PutRequest: {
                            Item: item
                        }
                    }))
                }
            };
            await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
        }
    }
    async getMoreStatuses(tableName, userAlias, pageSize, lastItem) {
        let attrToMatch;
        if (tableName == this.storyTableName) {
            attrToMatch = this.authorAttr;
        }
        else {
            attrToMatch = this.feedOwnerAttr;
        }
        console.log("Last item: ", lastItem);
        console.log("Last item user alias: ", lastItem?.user.alias);
        console.log("Last item timestamp: ", lastItem?.timestamp);
        const params = {
            TableName: tableName,
            KeyConditionExpression: `${attrToMatch} = :alias`,
            ExpressionAttributeValues: {
                ":alias": userAlias
            },
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: lastItem === null
                ? undefined
                : {
                    [attrToMatch]: userAlias,
                    [this.createdAtAttr]: lastItem.timestamp
                }
        };
        console.log("params: ", params);
        const statuses = [];
        const data = await DynamoDaoFactory_1.client.send(new lib_dynamodb_1.QueryCommand(params));
        console.log("data: ", data);
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) => {
            statuses.push(new tweeter_shared_1.Status(item[this.contentAttr], new tweeter_shared_1.User("tempFirstName", "tempLastName", item[this.authorAttr], "tempUrl"), item[this.createdAtAttr]));
        });
        return new DataPage_1.DataPage(statuses, hasMorePages);
    }
    createStoryItem(status) {
        return {
            [this.authorAttr]: status.user.alias,
            [this.createdAtAttr]: status.timestamp,
            [this.contentAttr]: status.post
        };
    }
    createFeedItem(status, followerAlias) {
        return {
            [this.feedOwnerAttr]: followerAlias,
            [this.authorAttr]: status.user.alias,
            [this.createdAtAttr]: status.timestamp,
            [this.contentAttr]: status.post
        };
    }
}
exports.StatusDaoDynamo = StatusDaoDynamo;
