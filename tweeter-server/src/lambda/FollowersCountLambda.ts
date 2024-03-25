import { UserCountResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

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
      await new FollowService().getFollowersCount(request.authToken, request.user),
      "Get followers count successful");
   return response;
};