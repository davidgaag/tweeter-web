import { AuthToken, FakeData, User } from "tweeter-shared";

export class FollowService {
   public async follow(
      authToken: AuthToken,
      userToFollow: User
   ): Promise<[followersCount: number, followeesCount: number]> {
      // TODO: M4: Real data

      let followersCount = await this.getFollowersCount(authToken, userToFollow);
      let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

      return [followersCount, followeesCount];
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
}