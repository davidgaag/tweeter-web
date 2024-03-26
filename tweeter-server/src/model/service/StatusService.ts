import { AuthToken, FakeData, Status, User } from "tweeter-shared";

export class StatusService {
   public async loadMoreStoryItems(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      // TODO: M4 - Real data
      return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
   }

   public async loadMoreFeedItems(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      // TODO: M4 - Real data
      return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
   };

   public async postStatus(
      authToken: AuthToken,
      newStatus: Status
   ): Promise<void> {
      // TODO: M4 Call the server to post the status
      console.log("I would have posted the status: " + newStatus.post + " if I were connected to the server.");
   };
}