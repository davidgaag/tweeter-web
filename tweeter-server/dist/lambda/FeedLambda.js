"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../model/service/StatusService");
const DynamoDaoFactory_1 = require("../dao/dynamoDB/DynamoDaoFactory");
const FeedHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.LoadMoreItemsRequest.statusesFromJson(event);
    }
    catch (error) {
        console.error("FeedHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.LoadMoreItemsResponse(true, ...await new StatusService_1.StatusService(new DynamoDaoFactory_1.DynamoDaoFactory()).loadMoreFeedItems(request.authToken, request.user, request.pageSize, request.lastItem), "Load more feed items successful");
    return response;
};
exports.FeedHandler = FeedHandler;
