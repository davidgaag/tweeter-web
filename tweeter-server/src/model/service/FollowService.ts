import { AuthToken, FakeData, User } from "tweeter-shared";
import { DaoFactory, FollowsDaoInterface, UserDaoInterface } from "../../dao/DaoInterfaces";
import { Service } from "./Service";

export class FollowService extends Service {
   private followsDao: FollowsDaoInterface;
   private userDao: UserDaoInterface;

   constructor(daoFactory: DaoFactory) {
      super(daoFactory);
      this.followsDao = daoFactory.getFollowsDao();
      this.userDao = daoFactory.getUserDao();
   }

   public async loadMoreFollowers(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
   ): Promise<[User[], boolean]> {
      const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      await this.getAssociatedAlias(authToken);

      const dataPage = await this.tryDbOperation(
         this.followsDao.getMoreFollowers(aliasWithoutAtSign, pageSize, lastItem?.alias ?? null));
      if (dataPage.values.length === 0) {
         return [[], false];
      }

      const followers = await this.tryDbOperation(this.userDao.getUsersByAlias(dataPage.values));
      for (let follower of followers) {
         follower.alias = this.addAtSign(follower.alias);
      }
      return [followers, dataPage.hasMorePages];
   };

   public async loadMoreFollowees(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
   ): Promise<[User[], boolean]> {
      const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      await this.getAssociatedAlias(authToken);

      console.log("before getMoreFollowees");
      const dataPage = await this.tryDbOperation(
         this.followsDao.getMoreFollowees(aliasWithoutAtSign, pageSize, lastItem?.alias ?? null));
      if (dataPage.values.length === 0) {
         return [[], false];
      }

      console.log("before getUsersByAlias")
      const followees = await this.tryDbOperation(this.userDao.getUsersByAlias(dataPage.values));
      for (let followee of followees) {
         followee.alias = this.addAtSign(followee.alias);
      }
      return [followees, dataPage.hasMorePages];
   };

   public async getIsFollowerStatus(
      authToken: AuthToken,
      user: User,
   ): Promise<boolean> {
      const followeeAliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      const followerAlias = await this.getAssociatedAlias(authToken);

      return await this.tryDbOperation(this.followsDao.getFollowingStatus(followerAlias, followeeAliasWithoutAtSign));
   };

   public async getFolloweesCount(
      authToken: AuthToken,
      user: User
   ): Promise<number> {
      const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      await this.getAssociatedAlias(authToken);

      const followeesCount = await this.tryDbOperation(this.userDao.getNumFollowees(aliasWithoutAtSign));
      if (followeesCount === undefined) {
         throw new Error("[Not Found] User not found");
      }

      return followeesCount;
   };

   public async getFollowersCount(
      authToken: AuthToken,
      user: User
   ): Promise<number> {
      const aliasWithoutAtSign = this.stripAtSign(user.alias).toLowerCase();
      await this.getAssociatedAlias(authToken);

      const followersCount = await this.tryDbOperation(this.userDao.getNumFollowers(aliasWithoutAtSign));
      if (followersCount === undefined) {
         throw new Error("[Not Found] User not found");
      }

      return followersCount;
   };

   public async follow(
      authToken: AuthToken,
      userToFollow: User
   ): Promise<[followersCount: number, followeesCount: number]> {
      const followeeAliasWithoutAtSign = this.stripAtSign(userToFollow.alias).toLowerCase();

      // Check if users exist
      const followerAlias = await this.getAssociatedAlias(authToken);
      if (followerAlias === followeeAliasWithoutAtSign) {
         throw new Error("[Bad Request] Cannot follow yourself");
      }
      const result = await this.tryDbOperation(this.userDao.getUserByAlias(followeeAliasWithoutAtSign));
      if (!result) {
         throw new Error("[Not Found] User not found");
      }

      // Follow user 
      if (!await this.tryDbOperation(this.followsDao.putFollow(followerAlias, followeeAliasWithoutAtSign))) {
         throw new Error("[Conflict] Already following user");
      }

      // Increment follow counts
      await this.tryDbOperation(this.userDao.incrementFollowees(followerAlias));
      const followersCount = await this.tryDbOperation(this.userDao.incrementFollowers(followeeAliasWithoutAtSign));

      // Get followee count for newly followed user (unchanged by the follow operation)
      const followeesCount = await this.tryDbOperation(this.userDao.getNumFollowees(followeeAliasWithoutAtSign));

      return [followersCount!, followeesCount!];
   };

   public async unfollow(
      authToken: AuthToken,
      userToUnfollow: User
   ): Promise<[followersCount: number, followeesCount: number]> {
      const followeeAliasWithoutAtSign = this.stripAtSign(userToUnfollow.alias).toLowerCase();

      // Check if users exist
      const followerAlias = await this.getAssociatedAlias(authToken);
      const result = await this.tryDbOperation(this.userDao.getUserByAlias(followeeAliasWithoutAtSign));
      if (!result) {
         throw new Error("[Not Found] User not found");
      }

      // Unfollow user
      if (!await this.tryDbOperation(this.followsDao.deleteFollow(followerAlias, followeeAliasWithoutAtSign))) {
         throw new Error("[Not Found] Not following user");
      }

      // Decrement follow counts
      await this.tryDbOperation(this.userDao.decrementFollowees(followerAlias));
      const followersCount = await this.tryDbOperation(this.userDao.decrementFollowers(followeeAliasWithoutAtSign));

      // Get followee count for newly unfollowed user (unchanged by the unfollow operation)
      const followeesCount = await this.tryDbOperation(this.userDao.getNumFollowees(followeeAliasWithoutAtSign));

      return [followersCount!, followeesCount!];
   };
}