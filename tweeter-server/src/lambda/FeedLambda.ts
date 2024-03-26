import { LoadMoreItemsRequest, LoadMoreItemsResponse, Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const FeedHandler = async (event: JSON): Promise<LoadMoreItemsResponse<Status>> => {
   let request: LoadMoreItemsRequest<Status>;
   try {
      request = LoadMoreItemsRequest.statusesFromJson(event);
   } catch (error) {
      console.error("FeedHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new LoadMoreItemsResponse<Status>(
      true,
      ...await new StatusService().loadMoreFeedItems(
         request.authToken,
         request.user,
         request.pageSize,
         request.lastItem
      ),
      "Load more feed items successful"
   );
   return response;
}