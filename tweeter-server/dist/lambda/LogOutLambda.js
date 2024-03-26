"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogOutHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
const LogOutHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.LogOutRequest.fromJson(event);
    }
    catch (error) {
        console.error("LogOutHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    await new UserService_1.UserService().logout(request.authToken);
    const response = new tweeter_shared_1.TweeterResponse(true, "Logged out successfully");
    return response;
};
exports.LogOutHandler = LogOutHandler;
