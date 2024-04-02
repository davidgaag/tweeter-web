import { AuthToken, FakeData, Follow, User } from "tweeter-shared";
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
      // TODO: M4: Real data
      return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
   };

   public async loadMoreFollowees(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
   ): Promise<[User[], boolean]> {
      // TODO: M4: Real data
      return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
   };

   public async getIsFollowerStatus(
      authToken: AuthToken,
      user: User,
      selectedUser: User
   ): Promise<boolean> {
      // TODO: M4: Real data
      return FakeData.instance.isFollower();
   };

   public async getFolloweesCount(
      authToken: AuthToken,
      user: User
   ): Promise<number> {
      // TODO: M4: Real data
      return FakeData.instance.getFolloweesCount(user);
   };

   public async getFollowersCount(
      authToken: AuthToken,
      user: User
   ): Promise<number> {
      // TODO: M4: Real data
      return FakeData.instance.getFollowersCount(user);
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
      const [followee, _] = result;

      // Follow user and update follow counts
      await this.tryDbOperation(this.followsDao.putFollow(followerAlias, followee.alias));

      await this.tryDbOperation(this.userDao.incrementFollowees(followerAlias));
      const followersCount = await this.tryDbOperation(this.userDao.incrementFollowers(followee.alias));
      const followeesCount = await this.tryDbOperation(this.userDao.getNumFollowees(followerAlias));

      return [followersCount!, followeesCount!]; // TODO: non-null assertion okay here?
   };

   public async unfollow(
      authToken: AuthToken,
      userToFollow: User
   ): Promise<[followersCount: number, followeesCount: number]> {
      // TODO: M4: Real data

      let followersCount = await this.getFollowersCount(authToken, userToFollow);
      let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

      return [followersCount, followeesCount];
   };


}