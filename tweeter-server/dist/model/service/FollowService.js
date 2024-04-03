"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const Service_1 = require("./Service");
class FollowService extends Service_1.Service {
    followsDao;
    userDao;
    constructor(daoFactory) {
        super(daoFactory);
        this.followsDao = daoFactory.getFollowsDao();
        this.userDao = daoFactory.getUserDao();
    }
    async loadMoreFollowers(authToken, user, pageSize, lastItem) {
        const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        await this.getAssociatedAlias(authToken);
        const dataPage = await this.tryDbOperation(this.followsDao.getMoreFollowers(aliasWithoutAtSign, pageSize, lastItem?.alias ?? null));
        if (dataPage.values.length === 0) {
            return [[], false];
        }
        const followers = await this.tryDbOperation(this.userDao.getUsersByAlias(dataPage.values));
        return [followers, dataPage.hasMorePages];
    }
    ;
    async loadMoreFollowees(authToken, user, pageSize, lastItem) {
        const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        await this.getAssociatedAlias(authToken);
        const dataPage = await this.tryDbOperation(this.followsDao.getMoreFollowees(aliasWithoutAtSign, pageSize, lastItem?.alias ?? null));
        if (dataPage.values.length === 0) {
            return [[], false];
        }
        const followees = await this.tryDbOperation(this.userDao.getUsersByAlias(dataPage.values));
        return [followees, dataPage.hasMorePages];
    }
    ;
    async getIsFollowerStatus(authToken, user) {
        const followeeAliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        const followerAlias = await this.getAssociatedAlias(authToken);
        return await this.tryDbOperation(this.followsDao.getFollowingStatus(followerAlias, followeeAliasWithoutAtSign));
    }
    ;
    async getFolloweesCount(authToken, user) {
        const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        await this.getAssociatedAlias(authToken);
        const followeesCount = await this.tryDbOperation(this.userDao.getNumFollowees(aliasWithoutAtSign));
        if (followeesCount === undefined) {
            throw new Error("[Not Found] User not found");
        }
        return followeesCount;
    }
    ;
    async getFollowersCount(authToken, user) {
        const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        await this.getAssociatedAlias(authToken);
        const followersCount = await this.tryDbOperation(this.userDao.getNumFollowers(aliasWithoutAtSign));
        console.log("followerscount:", followersCount);
        if (followersCount === undefined) {
            throw new Error("[Not Found] User not found");
        }
        return followersCount;
    }
    ;
    async follow(authToken, userToFollow) {
        const followeeAliasWithoutAtSign = this.stripAtSign(userToFollow.alias).toLowerCase();
        // Check if users exist
        const followerAlias = await this.getAssociatedAlias(authToken);
        const result = await this.tryDbOperation(this.userDao.getUserByAlias(followeeAliasWithoutAtSign));
        if (!result) {
            throw new Error("[Not Found] User not found");
        }
        // Follow user and update follow counts
        await this.tryDbOperation(this.followsDao.putFollow(followerAlias, followeeAliasWithoutAtSign));
        await this.tryDbOperation(this.userDao.incrementFollowees(followerAlias));
        console.log("incremented followees of follower ", followerAlias);
        const followersCount = await this.tryDbOperation(this.userDao.incrementFollowers(followeeAliasWithoutAtSign));
        console.log("incremented followers of ", followeeAliasWithoutAtSign, " count now: ", followersCount);
        const followeesCount = await this.tryDbOperation(this.userDao.getNumFollowees(followerAlias));
        console.log("got num followees for ", followerAlias, "count now: ", followeesCount);
        return [followersCount, followeesCount];
    }
    ;
    async unfollow(authToken, userToFollow) {
        const followeeAliasWithoutAtSign = this.stripAtSign(userToFollow.alias).toLowerCase();
        // Check if users exist
        const followerAlias = await this.getAssociatedAlias(authToken);
        const result = await this.tryDbOperation(this.userDao.getUserByAlias(followeeAliasWithoutAtSign));
        if (!result) {
            throw new Error("[Not Found] User not found");
        }
        const [followee, _] = result;
        // Unfollow user and update follow counts
        await this.tryDbOperation(this.followsDao.deleteFollow(followerAlias, followee.alias));
        await this.tryDbOperation(this.userDao.decrementFollowees(followerAlias));
        const followersCount = await this.tryDbOperation(this.userDao.decrementFollowers(followee.alias));
        const followeesCount = await this.tryDbOperation(this.userDao.getNumFollowees(followerAlias));
        return [followersCount, followeesCount];
    }
    ;
}
exports.FollowService = FollowService;
