"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
const LoginHandler = async (event) => {
    let response = new tweeter_shared_1.AuthResponse(true, ...await new UserService_1.UserService().login(event.username, event.password), "Login successful");
    return response;
};
exports.LoginHandler = LoginHandler;
