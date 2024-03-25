import { UserCountResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const FollowersCountHandler = async (event: UserRequest): Promise<UserCountResponse> => {
   let response = new UserCountResponse(
      true,
      await new FollowService().getFollowersCount(event.authToken, event.user),
      "Get followers count successful");
   return response;
};