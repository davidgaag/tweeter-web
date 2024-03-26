"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
const GetUserHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.GetUserRequest.fromJson(event);
    }
    catch (error) {
        console.error("GetUserHandler, error parsing request: " + error);
        throw new Error("[Bad Request] Invalid request");
    }
    const user = await new UserService_1.UserService().getUser(request.authToken, request.alias);
    if (user === null) {
        throw new Error("[Not Found] User not found");
    }
    // TODO: M4 error handling?
    let response = new tweeter_shared_1.GetUserResponse(true, user, "Get user successful");
    return response;
};
exports.GetUserHandler = GetUserHandler;
