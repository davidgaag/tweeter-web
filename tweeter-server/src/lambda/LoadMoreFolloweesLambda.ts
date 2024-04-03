import { LoadMoreItemsResponse, User, LoadMoreItemsRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const LoadMoreFolloweesHandler = async (event: JSON): Promise<LoadMoreItemsResponse<User>> => {
   let request: LoadMoreItemsRequest<User>;
   try {
      request = LoadMoreItemsRequest.usersFromJson(event);
   } catch (error) {
      console.error("LoadMoreFolloweesHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new LoadMoreItemsResponse<User>(
      true,
      ...await new FollowService(new DynamoDaoFactory()).loadMoreFollowees(
         request.authToken,
         request.user,
         request.pageSize,
         request.lastItem
      ),
      "Load more followees successful");
   return response;
}