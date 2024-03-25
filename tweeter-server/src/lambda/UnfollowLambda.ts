import { FollowResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const UnfollowHandler = async (event: JSON): Promise<FollowResponse> => {
   let request: UserRequest;
   try {
      request = UserRequest.fromJson(event);
   } catch (error) {
      console.error("UnfollowHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new FollowResponse(
      true,
      ...await new FollowService().unfollow(request.authToken, request.user),
      "Unfollow successful");
   return response;
};