"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowDaoFillTable = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const ClientDynamo_1 = require("./ClientDynamo");
const ServerVariables_1 = require("../util/ServerVariables");
const child_process_1 = require("child_process");
class FollowDaoFillTable {
    TABLE_NAME = (0, ServerVariables_1.getServerValue)('FOLLOW_TABLE_NAME');
    PRIMARY_KEY = (0, ServerVariables_1.getServerValue)('FOLLOW_PRIMARY_KEY');
    SORT_KEY = (0, ServerVariables_1.getServerValue)('FOLLOW_SORT_KEY');
    async createFollows(followeeAlias, followerAliasList) {
        if (followerAliasList.length == 0) {
            console.log('zero followers to batch write');
            return;
        }
        else {
            const params = {
                RequestItems: {
                    [this.TABLE_NAME]: this.createPutFollowRequestItems(followeeAlias, followerAliasList)
                }
            };
            await ClientDynamo_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(params))
                .then(async (resp) => {
                await this.putUnprocessedItems(resp, params, 0);
                return;
            })
                .catch(err => {
                throw new Error('Error while batchwriting follows with params: ' + params + ": \n" + err);
            });
        }
    }
    createPutFollowRequestItems(followeeAlias, followerAliasList) {
        let follwerAliasList = followerAliasList.map(followerAlias => this.createPutFollowRequest(followerAlias, followeeAlias));
        return follwerAliasList;
    }
    createPutFollowRequest(followerAlias, followeeAlias) {
        let item = {
            [this.PRIMARY_KEY]: followerAlias,
            [this.SORT_KEY]: followeeAlias,
        };
        let request = {
            PutRequest: {
                Item: item
            }
        };
        return request;
    }
    async putUnprocessedItems(resp, params, attempts) {
        if (attempts > 1)
            console.log(attempts + 'th attempt starting');
        ;
        if (resp.UnprocessedItems != undefined) {
            let sec = 0.03;
            if (Object.keys(resp.UnprocessedItems).length > 0) {
                console.log(Object.keys(resp.UnprocessedItems[this.TABLE_NAME]).length + ' unprocessed items');
                //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
                // @ts-ignore 
                params.RequestItems = resp.UnprocessedItems;
                (0, child_process_1.execSync)('sleep ' + sec);
                if (sec < 10)
                    sec += 0.1;
                await ClientDynamo_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(params))
                    .then(async (innerResp) => {
                    if (innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0) {
                        params.RequestItems = innerResp.UnprocessedItems;
                        ++attempts;
                        await this.putUnprocessedItems(innerResp, params, attempts);
                    }
                }).catch(err => {
                    console.log('error while batch writing unprocessed items ' + err);
                });
            }
        }
    }
}
exports.FollowDaoFillTable = FollowDaoFillTable;
