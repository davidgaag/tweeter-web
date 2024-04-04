"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostStatusHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Response_1 = require("tweeter-shared/dist/model/net/Response");
const StatusService_1 = require("../model/service/StatusService");
const DynamoDaoFactory_1 = require("../dao/dynamoDB/DynamoDaoFactory");
const PostStatusHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.PostStatusRequest.fromJson(event);
    }
    catch (error) {
        console.error("PostStatusHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    await new StatusService_1.StatusService(new DynamoDaoFactory_1.DynamoDaoFactory()).postStatus(request.authToken, request.newStatus);
    let response = new Response_1.TweeterResponse(true, "Status posted successfully");
    return response;
};
exports.PostStatusHandler = PostStatusHandler;
