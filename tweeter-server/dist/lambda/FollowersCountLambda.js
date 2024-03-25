"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowersCountHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const FollowersCountHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.UserRequest.fromJson(event);
    }
    catch (error) {
        console.error("FollowersCountHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.UserCountResponse(true, await new FollowService_1.FollowService().getFollowersCount(request.authToken, request.user), "Get followers count successful");
    return response;
};
exports.FollowersCountHandler = FollowersCountHandler;
