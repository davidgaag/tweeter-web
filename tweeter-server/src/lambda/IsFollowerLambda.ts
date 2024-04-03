import { IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";
import { UserRequest } from "tweeter-shared";

export const IsFollowerHandler = async (event: JSON): Promise<IsFollowerResponse> => {
   let request: UserRequest;
   try {
      request = UserRequest.fromJson(event);
   } catch (error) {
      console.error("IsFollowerHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new IsFollowerResponse(
      true,
      await new FollowService(new DynamoDaoFactory()).getIsFollowerStatus(request.authToken, request.user),
      "Following check successful");
   return response;
};