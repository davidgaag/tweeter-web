import { AuthToken, FakeData, User } from "tweeter-shared";

export class FollowService {
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
      // TODO: M4: Real data

      let followersCount = await this.getFollowersCount(authToken, userToFollow);
      let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

      return [followersCount, followeesCount];
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