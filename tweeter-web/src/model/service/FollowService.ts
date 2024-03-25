import { AuthToken, User, FakeData } from "tweeter-shared";
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
      // TODO: Replace with the result of calling server
      return FakeData.instance.isFollower();
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
      // Pause so we can see the following message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      // TODO: Call the server

      let followersCount = await this.getFollowersCount(authToken, userToFollow);
      let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

      return [followersCount, followeesCount];
   };

   public async unfollow(
      authToken: AuthToken,
      userToUnfollow: User
   ): Promise<[followersCount: number, followeesCount: number]> {
      // Pause so we can see the unfollowing message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      // TODO: Call the server

      let followersCount = await this.getFollowersCount(authToken, userToUnfollow);
      let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);

      return [followersCount, followeesCount];
   };
}