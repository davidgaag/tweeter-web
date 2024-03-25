import { AuthToken, User, FakeData, IsFollowerRequest } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";
import { UserRequest } from "tweeter-shared";

export class FollowService {
   private serverFacade = new ServerFacade();

   public async loadMoreFollowers(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
   ): Promise<[User[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
   };

   public async loadMoreFollowees(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
   ): Promise<[User[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
   };

   public async getIsFollowerStatus(
      authToken: AuthToken,
      user: User,
      selectedUser: User
   ): Promise<boolean> {
      return (await this.serverFacade.getIsFollowerStatus(
         new IsFollowerRequest(authToken, user, selectedUser))).isFollower;
   };

   public async getFolloweesCount(
      authToken: AuthToken,
      user: User
   ): Promise<number> {
      return (await this.serverFacade.getFolloweesCount(new UserRequest(authToken, user))).count;
   };

   public async getFollowersCount(
      authToken: AuthToken,
      user: User
   ): Promise<number> {
      return (await this.serverFacade.getFollowersCount(new UserRequest(authToken, user))).count;
   };

   public async follow(
      authToken: AuthToken,
      userToFollow: User
   ): Promise<[followersCount: number, followeesCount: number]> {
      // TODO: M4?
      const response = await this.serverFacade.follow(new UserRequest(authToken, userToFollow));
      return [response.followersCount, response.followeesCount];
   };

   public async unfollow(
      authToken: AuthToken,
      userToUnfollow: User
   ): Promise<[followersCount: number, followeesCount: number]> {
      // TODO: M4?
      const response = await this.serverFacade.unfollow(new UserRequest(authToken, userToUnfollow));
      return [response.followersCount, response.followeesCount];
   };
}