import { AuthToken, FakeData, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("StatusService", () => {
   let defaultUser: User;
   let authToken: AuthToken;
   let statusService: StatusService;

   beforeEach(() => {
      defaultUser = FakeData.instance.firstUser!;
      authToken = FakeData.instance.authToken;
      statusService = new StatusService();
   });

   it("loads multiple story pages", async () => {
      const limit = 10;
      const page1 = FakeData.instance.getPageOfStatuses(null, limit)[0];
      const page2 = FakeData.instance.getPageOfStatuses(page1[page1.length - 1], limit)[0];
      const page3 = FakeData.instance.getPageOfStatuses(page2[page2.length - 1], limit)[0];

      let result = await statusService.loadMoreStoryItems(authToken, defaultUser, limit, null);
      expect(result[0]).toEqual(page1);
      result = await statusService.loadMoreStoryItems(authToken, defaultUser, limit, page1[page1.length - 1]);
      expect(result[0]).toEqual(page2);
      result = await statusService.loadMoreStoryItems(authToken, defaultUser, limit, page2[page2.length - 1]);
      expect(result[0]).toEqual(page3);
   });

});