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
      const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      await this.getAssociatedAlias(authToken);

      const dataPage = await this.tryDbOperation(
         dbStatusLoadFunction(aliasWithoutAtSign, pageSize, lastItem));
      if (dataPage.values.length === 0) {
         return [[], false];
      }

      const statuses = dataPage.values;
      const aliases: string[] = [...new Set(statuses.map(status => status.user.alias))];
      const users = (await this.tryDbOperation(this.userDao.getUsersByAlias(aliases)));


      for (let status of statuses) {
         status.user = users.find(user => user.alias === status.user.alias)!;
      }

      for (let status of statuses) {
         status.user.alias = this.addAtSign(status.user.alias);
      }
      return [statuses, dataPage.hasMorePages];
   }
}