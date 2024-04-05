"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDaoFactory = exports.createTimeStamp = exports.client = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const AuthTokenDaoDynamo_1 = require("./AuthTokenDaoDynamo");
const FollowsDaoDynamo_1 = require("./FollowsDaoDynamo");
const ImageDaoS3_1 = require("./ImageDaoS3");
const UserDaoDynamo_1 = require("./UserDaoDynamo");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const StatusDaoDynamo_1 = require("./StatusDaoDynamo");
exports.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
const createTimeStamp = () => Math.floor(new Date().getTime());
exports.createTimeStamp = createTimeStamp;
class DynamoDaoFactory {
    getUserDao() { return new UserDaoDynamo_1.UserDaoDynamo(); }
    getImageDao() { return new ImageDaoS3_1.ImageDaoS3(); }
    getAuthTokenDao() { return new AuthTokenDaoDynamo_1.AuthTokenDaoDynamo(); }
    getFollowsDao() { return new FollowsDaoDynamo_1.FollowsDaoDynamo(); }
    getStatusDao() { return new StatusDaoDynamo_1.StatusDaoDynamo(); }
}
exports.DynamoDaoFactory = DynamoDaoFactory;
