import { AuthToken, User, Status, PostStatusRequest, LoadMoreItemsRequest } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService {
   private serverFacade = new ServerFacade();

   public async loadMoreStoryItems(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      const response = await this.serverFacade.loadMoreStoryItems(new LoadMoreItemsRequest<Status>(
         authToken, user, pageSize, lastItem));
      return [response.items, response.hasMorePages];
   }

   public async loadMoreFeedItems(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: Status | null
   ): Promise<[Status[], boolean]> {
      const response = await this.serverFacade.loadMoreFeedItems(new LoadMoreItemsRequest<Status>(
         authToken, user, pageSize, lastItem));
      return [response.items, response.hasMorePages];
   };

   public async postStatus(
      authToken: AuthToken,
      newStatus: Status
   ): Promise<void> {
      await this.serverFacade.postStatus(new PostStatusRequest(authToken, newStatus));
   };
}