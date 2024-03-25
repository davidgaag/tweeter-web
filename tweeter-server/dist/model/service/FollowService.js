"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async loadMoreFollowers(authToken, user, pageSize, lastItem) {
        // TODO: M4: Real data
        return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
    }
    ;
    async loadMoreFollowees(authToken, user, pageSize, lastItem) {
        // TODO: M4: Real data
        return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
    }
    ;
    async getIsFollowerStatus(authToken, user, selectedUser) {
        // TODO: M4: Real data
        return tweeter_shared_1.FakeData.instance.isFollower();
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
    async follow(authToken, userToFollow) {
        // TODO: M4: Real data
        let followersCount = await this.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToFollow);
        return [followersCount, followeesCount];
    }
    ;
    async unfollow(authToken, userToFollow) {
        // TODO: M4: Real data
        let followersCount = await this.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToFollow);
        return [followersCount, followeesCount];
    }
    ;
}
exports.FollowService = FollowService;
