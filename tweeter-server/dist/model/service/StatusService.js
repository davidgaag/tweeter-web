"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class StatusService {
    async loadMoreStoryItems(authToken, user, pageSize, lastItem) {
        // TODO: M4 - Real data
        return tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    }
    async loadMoreFeedItems(authToken, user, pageSize, lastItem) {
        // TODO: M4 - Real data
        return tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    }
    ;
    async postStatus(authToken, newStatus) {
        // TODO: M4 Call the server to post the status
        console.log("I would have posted the status: " + newStatus.post + " if I were connected to the server.");
    }
    ;
}
exports.StatusService = StatusService;
