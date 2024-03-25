import { UserCountResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const FolloweesCountHandler = async (event: UserRequest): Promise<UserCountResponse> => {
   let response = new UserCountResponse(
      true,
      await new FollowService().getFolloweesCount(event.authToken, event.user),
      "Get followees count successful");
   return response;
};