"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async follow(authToken, userToFollow) {
        // TODO: M4: Real data
        let followersCount = await this.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToFollow);
        return [followersCount, followeesCount];
    }
    ;
    async getFolloweesCount(authToken, user) {
        // TODO: M4: Real data
        return tweeter_shared_1.FakeData.instance.getFolloweesCount(user);
    }
    ;
    async getFollowersCount(authToken, user) {
        // TODO: M4: Real data
        return tweeter_shared_1.FakeData.instance.getFollowersCount(user);
    }
    ;
}
exports.FollowService = FollowService;
