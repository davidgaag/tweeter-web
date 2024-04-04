import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { DaoFactory, FollowsDaoInterface, StatusDaoInterface } from "../../dao/DaoInterfaces";
import { Service } from "./Service";
import { DataPage } from "../DataPage";

export class StatusService extends Service {
   private statusDao: StatusDaoInterface;
   private followsDao: FollowsDaoInterface;

   constructor(daoFactory: DaoFactory) {
      super(daoFactory);
      this.statusDao = daoFactory.getStatusDao();
      this.followsDao = daoFactory.getFollowsDao();
   }

   public async loadMoreStoryItems(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      return await this.loadMoreStatuses(
         this.statusDao.getMoreStoryItems.bind(this.statusDao),
         authToken,
         user,
         pageSize,
         lastItem
      );
   }

   public async loadMoreFeedItems(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      return await this.loadMoreStatuses(
         this.statusDao.getMoreFeedItems.bind(this.statusDao),
         authToken,
         user,
         pageSize,
         lastItem
      );
   };

   public async postStatus(
      authToken: AuthToken,
      newStatus: Status
   ): Promise<void> {
      if (newStatus.post.length === 0) {
         throw new Error("[Bad Request] Status content cannot be empty");
      }

      const authorizedUserAlias = await this.getAssociatedAlias(authToken);
      newStatus.user.alias = this.stripAtSign(newStatus.user.alias).toLowerCase();
      if (authorizedUserAlias !== newStatus.user.alias) {
         throw new Error("[Unauthorized] You are not authorized to post a status for this user");
      }

      await this.tryDbOperation(this.statusDao.putStatusInStory(newStatus));
      const followerAliases = (await this.tryDbOperation(this.followsDao.getMoreFollowers(authorizedUserAlias, null, null))).values;
      console.log("FOLLOWER ALIASES: ", followerAliases)
      await this.tryDbOperation(this.statusDao.putStatusInFeeds(newStatus, followerAliases));
   };

   private async loadMoreStatuses(
      dbStatusLoadFunction: (
         userAlias: string,
         pageSize: number,
         lastItem: Status | null
      ) => Promise<DataPage<Status>>,
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      console.log("IN LOADMORESTATUSES");
      const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      await this.getAssociatedAlias(authToken);

      console.log("BEFORE TRYDBOPERATION")
      const dataPage = await this.tryDbOperation(
         dbStatusLoadFunction(aliasWithoutAtSign, pageSize, lastItem));
      console.log("AFTER TRYDBOPERATION")
      if (dataPage.values.length === 0) {
         return [[], false];
      }

      const statuses = dataPage.values;
      console.log("STATUSES: ", statuses)
      const aliases: string[] = [...new Set(statuses.map(status => status.user.alias))];
      console.log("ALIASES: ", aliases)
      const users = (await this.tryDbOperation(this.userDao.getUsersByAlias(aliases)));
      console.log("USERS1: ", users)


      for (let status of statuses) {
         console.log("USERS2: ", users)
         console.log("STATUS: ", status)
         console.log("STATUS.USER.ALIAS: ", status.user.alias)
         status.user = users.find(user => user.alias === status.user.alias)!;
         console.log("STATUS.USER AFTER ASSIGN: ", status.user)
      }

      for (let status of statuses) {
         status.user.alias = this.addAtSign(status.user.alias);
      }
      return [statuses, dataPage.hasMorePages];
   }
}