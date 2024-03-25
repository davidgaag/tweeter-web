"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
const RegisterHandler = async (event) => {
    let response = new tweeter_shared_1.AuthResponse(true, ...await new UserService_1.UserService().register(event.firstName, event.lastName, event.alias, event.password, event.imageStringBase64), "Registration successful");
    return response;
};
exports.RegisterHandler = RegisterHandler;
