"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMoreFollowersHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const LoadMoreFollowersHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.LoadMoreItemsRequest.usersFromJson(event);
    }
    catch (error) {
        console.error("LoadMoreFollowersHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.LoadMoreItemsResponse(true, ...await new FollowService_1.FollowService().loadMoreFollowers(request.authToken, request.user, request.pageSize, request.lastItem), "Load more followers successful");
    return response;
};
exports.LoadMoreFollowersHandler = LoadMoreFollowersHandler;
