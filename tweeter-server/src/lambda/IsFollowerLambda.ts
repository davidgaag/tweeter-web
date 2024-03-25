import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const IsFollowerHandler = async (event: JSON): Promise<IsFollowerResponse> => {
   let request: IsFollowerRequest;
   try {
      request = IsFollowerRequest.fromJson(event);
   } catch (error) {
      console.error("IsFollowerHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new IsFollowerResponse(
      true,
      await new FollowService().getIsFollowerStatus(request.authToken, request.user, request.selectedUser),
      "Following check successful");
   return response;
};