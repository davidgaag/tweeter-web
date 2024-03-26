import { AuthToken, FakeData, LoadMoreItemsRequest, RegisterRequest, User, UserRequest } from "tweeter-shared";
import { ServerFacade } from "../../../src/model/net/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade", () => {
   let serverFacade: ServerFacade;
   let defaultUser: User;
   let authToken: AuthToken;

   beforeEach(() => {
      defaultUser = FakeData.instance.firstUser!;
      authToken = FakeData.instance.authToken;
      serverFacade = new ServerFacade();
   });

   it("registers a user", async () => {
      const response = await serverFacade.register(new RegisterRequest(
         "testFirst", "testLast", "testAlias", "testPassword", "testImage"));
      expect(response.success).toBe(true);
      expect(response.user).toEqual(defaultUser);
   });

   it("gets followers", async () => {
      const amount = 10;

      let response = await serverFacade.loadMoreFollowers(new LoadMoreItemsRequest<User>(
         authToken, defaultUser, amount, null));

      let followers = response.items;

      expect(response.success).toBe(true);
      expect(followers).toEqual(FakeData.instance.getPageOfUsers(null, amount, defaultUser)[0]);

      response = await serverFacade.loadMoreFollowers(new LoadMoreItemsRequest<User>(
         authToken, defaultUser, amount, followers[followers.length - 1]));
      expect(response.success).toBe(true);
      followers.forEach((follower) => { expect(response.items).not.toContain(follower) });
   });

   it("gets following count", async () => {
      const response = await serverFacade.getFolloweesCount(new UserRequest(authToken, defaultUser));
      expect(response.success).toBe(true);
      expect(response.count).toBe(FakeData.instance.getFolloweesCount(defaultUser));
   });
});