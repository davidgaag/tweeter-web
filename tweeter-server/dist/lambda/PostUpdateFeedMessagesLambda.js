"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowsDaoDynamo_1 = require("../dao/dynamoDB/FollowsDaoDynamo");
const Sqs_1 = require("../model/Sqs");
const handler = async function (event) {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        const status = tweeter_shared_1.Status.fromJson(body);
        const alias = status.user.alias.slice(1);
        const dataPage = await new FollowsDaoDynamo_1.FollowsDaoDynamo().getMoreFollowers(status.user.alias, null, null);
        console.log("dataPage: ", dataPage);
        const followers = dataPage.values;
        const sqs_url = "https://sqs.us-east-2.amazonaws.com/533267155110/UserFeedsToUpdate";
        for (let i = 0; i < followers.length; i += 25) {
            const followersChunk = followers.slice(i, i + 25);
            const message = {
                followers: followersChunk,
                status: status.toJson()
            };
            await (0, Sqs_1.sendMessage)(sqs_url, JSON.stringify(message));
        }
    }
    return null;
};
exports.handler = handler;
