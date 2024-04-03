import { LoadMoreItemsRequest, LoadMoreItemsResponse, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const LoadMoreFollowersHandler = async (event: JSON): Promise<LoadMoreItemsResponse<User>> => {
   let request: LoadMoreItemsRequest<User>;
   try {
      request = LoadMoreItemsRequest.usersFromJson(event);
   } catch (error) {
      console.error("LoadMoreFollowersHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new LoadMoreItemsResponse<User>(
      true,
      ...await new FollowService(new DynamoDaoFactory()).loadMoreFollowers(
         request.authToken,
         request.user,
         request.pageSize,
         request.lastItem
      ),
      "Load more followers successful");
   return response;
};
