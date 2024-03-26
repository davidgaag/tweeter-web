"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../model/service/StatusService");
const StoryHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.LoadMoreItemsRequest.statusesFromJson(event);
    }
    catch (error) {
        console.error("StoryHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.LoadMoreItemsResponse(true, ...await new StatusService_1.StatusService().loadMoreStoryItems(request.authToken, request.user, request.pageSize, request.lastItem), "Load more story items successful");
    return response;
};
exports.StoryHandler = StoryHandler;
