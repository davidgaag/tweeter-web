"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
const DynamoDaoFactory_1 = require("../dao/dynamoDB/DynamoDaoFactory");
const RegisterHandler = async (event) => {
    let request;
    try {
        request = tweeter_shared_1.RegisterRequest.fromJson(event);
    }
    catch (error) {
        throw new Error("[Bad Request] Invalid request");
    }
    let response = new tweeter_shared_1.AuthResponse(true, ...await new UserService_1.UserService(new DynamoDaoFactory_1.DynamoDaoFactory()).register(request.firstName, request.lastName, request.alias, request.password, request.imageStringBase64), "Registration successful");
    return response;
};
exports.RegisterHandler = RegisterHandler;
