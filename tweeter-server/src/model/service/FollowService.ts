import { AuthToken, FakeData, User } from "tweeter-shared";
import { DaoFactory, FollowsDaoInterface, UserDaoInterface } from "../../dao/DaoInterfaces";
import { Service } from "./Service";

export class FollowService extends Service {
   private followsDao: FollowsDaoInterface;

   constructor(daoFactory: DaoFactory) {
      super(daoFactory);
      this.followsDao = daoFactory.getFollowsDao();
   }

   public async loadMoreFollowers(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
   ): Promise<[User[], boolean]> {
      console.log("loadMoreFollowers: ", user, pageSize, lastItem);
      return await this.loadMoreFollows(authToken, user, pageSize, lastItem, true);
   };

   public async loadMoreFollowees(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
   ): Promise<[User[], boolean]> {
      return await this.loadMoreFollows(authToken, user, pageSize, lastItem, false);
   };

   public async getIsFollowerStatus(
      authToken: AuthToken,
      user: User,
   ): Promise<boolean> {
      const followeeAliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      const followerAlias = await this.getAssociatedAlias(authToken);

      return await this.tryDbOperation(
         this.followsDao.getFollowingStatus(followerAlias, followeeAliasWithoutAtSign)
      );
   };

   public async getFollowersCount(authToken: AuthToken, user: User) {
      return this.getFollowCount(authToken, user, true);
   };

   public async getFolloweesCount(authToken: AuthToken, user: User) {
      return this.getFollowCount(authToken, user, false);
   };

   public async follow(authToken: AuthToken, userToFollow: User):
      Promise<[followersCount: number, followeesCount: number]> {
      return this.doFollowOperation(authToken, userToFollow, true);
   };

   public async unfollow(authToken: AuthToken, userToUnfollow: User):
      Promise<[followersCount: number, followeesCount: number]> {
      return this.doFollowOperation(authToken, userToUnfollow, false);
   };

   private async loadMoreFollows(authToken: AuthToken,
      user: User, pageSize: number,
      lastItem: User | null,
      isFollowers: boolean)
      : Promise<[User[], boolean]> {
      const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      if (lastItem) {
         lastItem.alias = this.stripAtSign(lastItem.alias).toLowerCase();
      }
      await this.getAssociatedAlias(authToken);

      console.log("ISFOLLOWERS: ", isFollowers);

      const dataPage = await this.tryDbOperation(
         isFollowers
            ? this.followsDao.getMoreFollowers(
               aliasWithoutAtSign,
               pageSize,
               lastItem?.alias ?? null
            )
            : this.followsDao.getMoreFollowees(
               aliasWithoutAtSign,
               pageSize,
               lastItem?.alias ?? null
            )
      );

      if (dataPage.values.length === 0) {
         return [[], false];
      }

      const unsortedUsers = await this.tryDbOperation(this.userDao.getUsersByAlias(dataPage.values));
      const usersMap = new Map<string, User>();
      for (let user of unsortedUsers) {
         usersMap.set(user.alias, user);
      }

      console.log("UNSORTED USERS in SERVICE: ", unsortedUsers);
      let follows: User[] = [];
      for (let followAlias of dataPage.values) {
         follows.push(usersMap.get(followAlias)!);
         follows[follows.length - 1].alias = this.addAtSign(followAlias);
      }
      console.log("SERVICE RESULT loadMoreFollows: ", follows, dataPage.hasMorePages)
      return [follows, dataPage.hasMorePages];
   }

   private async getFollowCount(authToken: AuthToken, user: User, isFollowers: boolean) {
      const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      await this.getAssociatedAlias(authToken);

      const count = await this.tryDbOperation(
         isFollowers
            ? this.userDao.getNumFollowers(aliasWithoutAtSign)
            : this.userDao.getNumFollowees(aliasWithoutAtSign)
      );
      if (count === undefined) {
         throw new Error("[Not Found] User not found");
      }

      return count;
   }

   private async doFollowOperation(authToken: AuthToken, targetUser: User, isFollow: boolean):
      Promise<[followersCount: number, followeesCount: number]> {
      const followeeAliasWithoutAtSign = this.stripAtSign(targetUser.alias).toLowerCase();

      // Check if users exist
      const followerAlias = await this.getAssociatedAlias(authToken);
      if (followerAlias === followeeAliasWithoutAtSign) {
         throw new Error("[Bad Request] Cannot follow/unfollow yourself");
      }
      const result = await this.tryDbOperation(
         this.userDao.getUserByAlias(followeeAliasWithoutAtSign)
      );
      if (!result) {
         throw new Error("[Not Found] User not found");
      }

      // Follow/unfollow user
      if (isFollow) {
         if (!await this.tryDbOperation(
            this.followsDao.putFollow(followerAlias, followeeAliasWithoutAtSign)
         )) {
            throw new Error("[Conflict] Already following user");
         }
      } else {
         if (!await this.tryDbOperation(
            this.followsDao.deleteFollow(followerAlias, followeeAliasWithoutAtSign)
         )) {
            throw new Error("[Not Found] Not following user");
         }
      }

      // Increment/decrement follow counts
      let followersCount: number;
      if (isFollow) {
         await this.tryDbOperation(this.userDao.incrementFollowees(followerAlias));
         followersCount = (await this.tryDbOperation(
            this.userDao.incrementFollowers(followeeAliasWithoutAtSign)
         ))!;
      } else {
         await this.tryDbOperation(this.userDao.decrementFollowees(followerAlias));
         followersCount = (await this.tryDbOperation(
            this.userDao.decrementFollowers(followeeAliasWithoutAtSign)
         ))!;
      }

      // Get followee count for target user (which was unchanged by the follow/unfollow operation)
      const followeesCount = (await this.tryDbOperation(
         this.userDao.getNumFollowees(followeeAliasWithoutAtSign)
      ))!;

      return [followersCount, followeesCount];
   }
}