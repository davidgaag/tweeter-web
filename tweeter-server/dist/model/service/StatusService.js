"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const Service_1 = require("./Service");
class StatusService extends Service_1.Service {
    statusDao;
    followsDao; // TODO: remove this?
    constructor(daoFactory) {
        super(daoFactory);
        this.statusDao = daoFactory.getStatusDao();
        this.followsDao = daoFactory.getFollowsDao();
    }
    async loadMoreStoryItems(authToken, user, pageSize, lastItem) {
        return await this.loadMoreStatuses(this.statusDao.getMoreStoryItems.bind(this.statusDao), authToken, user, pageSize, lastItem);
    }
    async loadMoreFeedItems(authToken, user, pageSize, lastItem) {
        return await this.loadMoreStatuses(this.statusDao.getMoreFeedItems.bind(this.statusDao), authToken, user, pageSize, lastItem);
    }
    async postStatusToStory(authToken, newStatus) {
        if (newStatus.post.length === 0) {
            throw new Error("[Bad Request] Status content cannot be empty");
        }
        const authorizedUserAlias = await this.getAssociatedAlias(authToken);
        newStatus.user.alias = this.stripAtSign(newStatus.user.alias).toLowerCase();
        if (authorizedUserAlias !== newStatus.user.alias) {
            throw new Error("[Unauthorized] You are not authorized to post a status for this user");
        }
        await this.tryDbOperation(this.statusDao.putStatusInStory(newStatus));
        // Commented for M4B
        // const followerAliases = (await this.tryDbOperation(this.followsDao.getMoreFollowers(authorizedUserAlias, null, null))).values;
        // await this.tryDbOperation(this.statusDao.putStatusInFeeds(newStatus, followerAliases));
    }
    async postStatusToFeeds(status, followerAliases) {
        this.stripAtSign(status.user.alias);
        console.log("status, followerAliases", status, followerAliases);
        await this.tryDbOperation(this.statusDao.putStatusInFeeds(status, followerAliases));
    }
    async loadMoreStatuses(dbStatusLoadFunction, authToken, user, pageSize, lastItem) {
        const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
        if (lastItem) {
            lastItem.user.alias = this.stripAtSign(lastItem.user.alias).toLowerCase();
        }
        await this.getAssociatedAlias(authToken);
        const dataPage = await this.tryDbOperation(dbStatusLoadFunction(aliasWithoutAtSign, pageSize, lastItem));
        if (dataPage.values.length === 0) {
            return [[], false];
        }
        const statuses = dataPage.values;
        const aliases = [...new Set(statuses.map(status => status.user.alias))];
        const users = (await this.tryDbOperation(this.userDao.getUsersByAlias(aliases)));
        for (let status of statuses) {
            status.user = users.find(user => user.alias === status.user.alias);
        }
        for (let status of statuses) {
            status.user.alias = this.addAtSign(status.user.alias);
        }
        return [statuses, dataPage.hasMorePages];
    }
}
exports.StatusService = StatusService;
