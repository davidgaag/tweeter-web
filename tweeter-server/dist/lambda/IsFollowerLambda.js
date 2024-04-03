"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFollowerHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const DynamoDaoFactory_1 = require("../dao/dynamoDB/DynamoDaoFactory");
const tweeter_shared_2 = require("tweeter-shared");
const IsFollowerHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_2.UserRequest.fromJson(event);
    }
    catch (error) {
        console.error("IsFollowerHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.IsFollowerResponse(true, await new FollowService_1.FollowService(new DynamoDaoFactory_1.DynamoDaoFactory()).getIsFollowerStatus(request.authToken, request.user), "Following check successful");
    return response;
};
exports.IsFollowerHandler = IsFollowerHandler;
