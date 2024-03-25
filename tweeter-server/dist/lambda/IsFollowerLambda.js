"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFollowerHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const IsFollowerHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.IsFollowerRequest.fromJson(event);
    }
    catch (error) {
        console.error("IsFollowerHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.IsFollowerResponse(true, await new FollowService_1.FollowService().getIsFollowerStatus(request.authToken, request.user, request.selectedUser), "Following check successful");
    return response;
};
exports.IsFollowerHandler = IsFollowerHandler;
