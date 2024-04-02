"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDaoFactory = void 0;
const AuthTokenDaoDynamo_1 = require("./AuthTokenDaoDynamo");
const FollowsDaoDynamo_1 = require("./FollowsDaoDynamo");
const ImageDaoS3_1 = require("./ImageDaoS3");
const UserDaoDynamo_1 = require("./UserDaoDynamo");
class DynamoDaoFactory {
    getUserDao() { return new UserDaoDynamo_1.UserDaoDynamo(); }
    getImageDao() { return new ImageDaoS3_1.ImageDaoS3(); }
    getAuthTokenDao() { return new AuthTokenDaoDynamo_1.AuthTokenDaoDynamo(); }
    getFollowsDao() { return new FollowsDaoDynamo_1.FollowsDaoDynamo(); }
}
exports.DynamoDaoFactory = DynamoDaoFactory;
