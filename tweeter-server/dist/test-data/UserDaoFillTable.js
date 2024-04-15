"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDaoFillTable = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const ClientDynamo_1 = require("./ClientDynamo");
const ServerVariables_1 = require("../util/ServerVariables");
const crypto_js_1 = require("crypto-js");
const child_process_1 = require("child_process");
class UserDaoFillTable {
    TABLE_NAME = (0, ServerVariables_1.getServerValue)('USER_TABLE_NAME');
    PRIMARY_KEY = (0, ServerVariables_1.getServerValue)('USER_PRIMARY_KEY');
    FIRST_NAME = (0, ServerVariables_1.getServerValue)('USER_FIRST_NAME');
    LAST_NAME = (0, ServerVariables_1.getServerValue)('USER_LAST_NAME');
    PASSWORD = (0, ServerVariables_1.getServerValue)('USER_PASSWORD');
    IMAGE_URL = (0, ServerVariables_1.getServerValue)('USER_IMAGE_URL');
    FOLLOWING_COUNT = (0, ServerVariables_1.getServerValue)('USER_FOLLOWING_COUNT');
    FOLLOWERS_COUNT = (0, ServerVariables_1.getServerValue)('USER_FOLLOWERS_COUNT');
    async createUsers(userList, password) {
        if (userList.length == 0) {
            console.log('zero followers to batch write');
            return;
        }
        else {
            const hashedPassword = (0, crypto_js_1.SHA256)(password).toString();
            const params = {
                RequestItems: {
                    [this.TABLE_NAME]: this.createPutUserRequestItems(userList, hashedPassword)
                }
            };
            await ClientDynamo_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(params))
                .then(async (resp) => {
                await this.putUnprocessedItems(resp, params);
            })
                .catch(err => {
                throw new Error('Error while batchwriting users with params: ' + params + ": \n" + err);
            });
            ;
        }
    }
    createPutUserRequestItems(userList, hashedPassword) {
        return userList.map(user => this.createPutUserRequest(user, hashedPassword));
    }
    createPutUserRequest(user, hashedPassword) {
        let item = {
            [this.PRIMARY_KEY]: user.alias,
            [this.FIRST_NAME]: user.firstName,
            [this.LAST_NAME]: user.lastName,
            [this.PASSWORD]: hashedPassword,
            [this.IMAGE_URL]: user.imageUrl,
            [this.FOLLOWERS_COUNT]: 0,
            [this.FOLLOWING_COUNT]: 1
        };
        let request = {
            PutRequest: {
                Item: item
            }
        };
        return request;
    }
    async putUnprocessedItems(resp, params) {
        if (resp.UnprocessedItems != undefined) {
            let sec = 0.01;
            while (Object.keys(resp.UnprocessedItems).length > 0) {
                console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
                //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
                // @ts-ignore 
                params.RequestItems = resp.UnprocessedItems;
                (0, child_process_1.execSync)('sleep ' + sec);
                if (sec < 1)
                    sec += 0.1;
                await ClientDynamo_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(params));
                if (resp.UnprocessedItems == undefined) {
                    break;
                }
            }
        }
    }
    increaseFollowersCount(alias, count) {
        const params = {
            TableName: this.TABLE_NAME,
            Key: { [this.PRIMARY_KEY]: alias },
            ExpressionAttributeValues: { ":inc": count },
            UpdateExpression: "SET " + this.FOLLOWERS_COUNT + " = " + this.FOLLOWERS_COUNT + ' + :inc'
        };
        ClientDynamo_1.ddbDocClient.send(new lib_dynamodb_1.UpdateCommand(params)).then(data => {
            return true;
        });
    }
}
exports.UserDaoFillTable = UserDaoFillTable;
