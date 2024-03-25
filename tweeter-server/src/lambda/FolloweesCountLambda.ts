import { UserCountResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const FolloweesCountHandler = async (event: JSON): Promise<UserCountResponse> => {
   let request: UserRequest;
   try {
      request = UserRequest.fromJson(event);
   } catch (error) {
      console.error("FolloweesCountHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new UserCountResponse(
      true,
      await new FollowService().getFolloweesCount(request.authToken, request.user),
      "Get followees count successful");
   return response;
};