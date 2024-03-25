"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolloweesCountHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const FolloweesCountHandler = async (event) => {
    let response = new tweeter_shared_1.UserCountResponse(true, await new FollowService_1.FollowService().getFolloweesCount(event.authToken, event.user), "Get followees count successful");
    return response;
};
exports.FolloweesCountHandler = FolloweesCountHandler;
