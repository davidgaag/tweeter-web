"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const FollowHandler = async (event) => {
    let response = new tweeter_shared_1.FollowResponse(true, ...await new FollowService_1.FollowService().follow(event.authToken, event.user), "Follow successful");
    return response;
};
exports.FollowHandler = FollowHandler;
