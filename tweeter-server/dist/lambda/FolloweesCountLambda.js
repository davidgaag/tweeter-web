"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolloweesCountHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const DynamoDaoFactory_1 = require("../dao/dynamoDB/DynamoDaoFactory");
const FolloweesCountHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.UserRequest.fromJson(event);
    }
    catch (error) {
        console.error("FolloweesCountHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.UserCountResponse(true, await new FollowService_1.FollowService(new DynamoDaoFactory_1.DynamoDaoFactory()).getFolloweesCount(request.authToken, request.user), "Get followees count successful");
    return response;
};
exports.FolloweesCountHandler = FolloweesCountHandler;
