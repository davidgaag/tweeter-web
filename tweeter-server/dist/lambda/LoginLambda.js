"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
const DynamoDaoFactory_1 = require("../dao/dynamoDB/DynamoDaoFactory");
const LoginHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.LoginRequest.fromJson(event);
    }
    catch (error) {
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.AuthResponse(true, ...await new UserService_1.UserService(new DynamoDaoFactory_1.DynamoDaoFactory()).login(request.username, request.password), "Login successful");
    return response;
};
exports.LoginHandler = LoginHandler;
