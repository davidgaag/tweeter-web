"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const Service_1 = require("./Service");
class FollowService extends Service_1.Service {
    followsDao;
    constructor(daoFactory) {
        super(daoFactory);
        this.followsDao = daoFactory.getFollowsDao();
    }
    async loadMoreFollowers(authToken, user, pageSize, lastItem) {
        console.log("loadMoreFollowers: ", user, pageSize, lastItem);
        return await this.loadMoreFollows(authToken, user, pageSize, lastItem, true);
    }
    ;
    async loadMoreFollowees(authToken, user, pageSize, lastItem) {
        return await this.loadMoreFollows(authToken, user, pageSize, lastItem, false);
    }
    ;
    async getIsFollowerStatus(authToken, user) {
        const followeeAliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        const followerAlias = await this.getAssociatedAlias(authToken);
        return await this.tryDbOperation(this.followsDao.getFollowingStatus(followerAlias, followeeAliasWithoutAtSign));
    }
    ;
    async getFollowersCount(authToken, user) {
        return this.getFollowCount(authToken, user, true);
    }
    ;
    async getFolloweesCount(authToken, user) {
        return this.getFollowCount(authToken, user, false);
    }
    ;
    async follow(authToken, userToFollow) {
        return this.doFollowOperation(authToken, userToFollow, true);
    }
    ;
    async unfollow(authToken, userToUnfollow) {
        return this.doFollowOperation(authToken, userToUnfollow, false);
    }
    ;
    async loadMoreFollows(authToken, user, pageSize, lastItem, isFollowers) {
        const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        if (lastItem) {
            lastItem.alias = this.stripAtSign(lastItem.alias).toLowerCase();
        }
        await this.getAssociatedAlias(authToken);
        console.log("ISFOLLOWERS: ", isFollowers);
        const dataPage = await this.tryDbOperation(isFollowers
            ? this.followsDao.getMoreFollowers(aliasWithoutAtSign, pageSize, lastItem?.alias ?? null)
            : this.followsDao.getMoreFollowees(aliasWithoutAtSign, pageSize, lastItem?.alias ?? null));
        if (dataPage.values.length === 0) {
            return [[], false];
        }
        const unsortedUsers = await this.tryDbOperation(this.userDao.getUsersByAlias(dataPage.values));
        const usersMap = new Map();
        for (let user of unsortedUsers) {
            usersMap.set(user.alias, user);
        }
        console.log("UNSORTED USERS in SERVICE: ", unsortedUsers);
        let follows = [];
        for (let followAlias of dataPage.values) {
            follows.push(usersMap.get(followAlias));
            follows[follows.length - 1].alias = this.addAtSign(followAlias);
        }
        console.log("SERVICE RESULT loadMoreFollows: ", follows, dataPage.hasMorePages);
        return [follows, dataPage.hasMorePages];
    }
    async getFollowCount(authToken, user, isFollowers) {
        const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        await this.getAssociatedAlias(authToken);
        const count = await this.tryDbOperation(isFollowers
            ? this.userDao.getNumFollowers(aliasWithoutAtSign)
            : this.userDao.getNumFollowees(aliasWithoutAtSign));
        if (count === undefined) {
            throw new Error("[Not Found] User not found");
        }
        return count;
    }
    async doFollowOperation(authToken, targetUser, isFollow) {
        const followeeAliasWithoutAtSign = this.stripAtSign(targetUser.alias).toLowerCase();
        // Check if users exist
        const followerAlias = await this.getAssociatedAlias(authToken);
        if (followerAlias === followeeAliasWithoutAtSign) {
            throw new Error("[Bad Request] Cannot follow/unfollow yourself");
        }
        const result = await this.tryDbOperation(this.userDao.getUserByAlias(followeeAliasWithoutAtSign));
        if (!result) {
            throw new Error("[Not Found] User not found");
        }
        // Follow/unfollow user
        if (isFollow) {
            if (!await this.tryDbOperation(this.followsDao.putFollow(followerAlias, followeeAliasWithoutAtSign))) {
                throw new Error("[Conflict] Already following user");
            }
        }
        else {
            if (!await this.tryDbOperation(this.followsDao.deleteFollow(followerAlias, followeeAliasWithoutAtSign))) {
                throw new Error("[Not Found] Not following user");
            }
        }
        // Increment/decrement follow counts
        let followersCount;
        if (isFollow) {
            await this.tryDbOperation(this.userDao.incrementFollowees(followerAlias));
            followersCount = (await this.tryDbOperation(this.userDao.incrementFollowers(followeeAliasWithoutAtSign)));
        }
        else {
            await this.tryDbOperation(this.userDao.decrementFollowees(followerAlias));
            followersCount = (await this.tryDbOperation(this.userDao.decrementFollowers(followeeAliasWithoutAtSign)));
        }
        // Get followee count for target user (which was unchanged by the follow/unfollow operation)
        const followeesCount = (await this.tryDbOperation(this.userDao.getNumFollowees(followeeAliasWithoutAtSign)));
        return [followersCount, followeesCount];
    }
}
exports.FollowService = FollowService;
