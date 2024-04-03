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

      const dataPage = await this.tryDbOperation(
         this.followsDao.getMoreFollowees(aliasWithoutAtSign, pageSize, lastItem?.alias ?? null));
      if (dataPage.values.length === 0) {
         return [[], false];
      }

      const followees = await this.tryDbOperation(this.userDao.getUsersByAlias(dataPage.values));
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
      console.log("followerscount:", followersCount);
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
      return [followersCount!, followeesCount!];
   };

   public async unfollow(
      authToken: AuthToken,
      userToFollow: User
   ): Promise<[followersCount: number, followeesCount: number]> {
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

      return [followersCount!, followeesCount!];
   };
}