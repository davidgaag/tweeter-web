"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../model/service/StatusService");
const DynamoDaoFactory_1 = require("../dao/dynamoDB/DynamoDaoFactory");
const handler = async function (event) {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        console.log("body: ", body);
        const bodyObj = JSON.parse(body);
        const status = tweeter_shared_1.Status.fromJson(bodyObj.status);
        const followers = bodyObj.followers;
        // Send the status to the followers' feeds
        try {
            await new StatusService_1.StatusService(new DynamoDaoFactory_1.DynamoDaoFactory()).postStatusToFeeds(status, followers);
        }
        catch (error) {
            console.error("Failed to post status to feeds because of exception: ", error);
            throw error;
        }
    }
    return null;
};
exports.handler = handler;
