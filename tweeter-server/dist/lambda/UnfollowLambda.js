"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnfollowHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const UnfollowHandler = async (event) => {
    let response = new tweeter_shared_1.FollowResponse(true, ...await new FollowService_1.FollowService().unfollow(event.authToken, event.user), "Unfollow successful");
    return response;
};
exports.UnfollowHandler = UnfollowHandler;
