import { FollowResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const FollowHandler = async (event: UserRequest): Promise<FollowResponse> => {
   let response = new FollowResponse(
      true,
      ...await new FollowService().follow(event.authToken, event.user),
      "Follow successful");
   return response;
};