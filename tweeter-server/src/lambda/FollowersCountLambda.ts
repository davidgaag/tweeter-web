import { UserCountResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const FollowersCountHandler = async (event: JSON): Promise<UserCountResponse> => {
   let request: UserRequest;
   try {
      request = UserRequest.fromJson(event);
   } catch (error) {
      console.error("FollowersCountHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new UserCountResponse(
      true,
      await new FollowService(new DynamoDaoFactory()).getFollowersCount(request.authToken, request.user),
      "Get followers count successful");
   return response;
};