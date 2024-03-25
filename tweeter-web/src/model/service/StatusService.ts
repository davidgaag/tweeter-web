import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService {
   private serverFacade = new ServerFacade();

   public async loadMoreStoryItems(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
   }

   public async loadMoreFeedItems(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
   };

   public async postStatus(
      authToken: AuthToken,
      newStatus: Status
   ): Promise<void> {
      // Pause so we can see the logging out message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      // TODO: Call the server to post the status
   };
}