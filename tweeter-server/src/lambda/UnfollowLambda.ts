import { FollowResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const UnfollowHandler = async (event: UserRequest): Promise<FollowResponse> => {
   let response = new FollowResponse(
      true,
      ...await new FollowService().unfollow(event.authToken, event.user),
      "Unfollow successful");
   return response;
};