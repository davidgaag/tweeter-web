"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMoreFolloweesHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const LoadMoreFolloweesHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.LoadMoreItemsRequest.usersFromJson(event);
    }
    catch (error) {
        console.error("LoadMoreFolloweesHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.LoadMoreItemsResponse(true, ...await new FollowService_1.FollowService().loadMoreFollowees(request.authToken, request.user, request.pageSize, request.lastItem), "Load more followees successful");
    return response;
};
exports.LoadMoreFolloweesHandler = LoadMoreFolloweesHandler;
