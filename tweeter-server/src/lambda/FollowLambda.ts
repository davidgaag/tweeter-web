import { FollowResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const FollowHandler = async (event: JSON): Promise<FollowResponse> => {
   let request: UserRequest;
   try {
      request = UserRequest.fromJson(event);
   } catch (error) {
      console.error("FollowHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new FollowResponse(
      true,
      ...await new FollowService().follow(request.authToken, request.user),
      "Follow successful");
   return response;
};