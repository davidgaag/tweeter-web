import { UserCountResponse, UserRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const FolloweesCountHandler = async (event: JSON): Promise<UserCountResponse> => {
   console.log("entering followees count handler");
   let request: UserRequest;
   try {
      request = UserRequest.fromJson(event);
   } catch (error) {
      console.error("FolloweesCountHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   console.log("In followees count handler");
   let response = new UserCountResponse(
      true,
      await new FollowService(new DynamoDaoFactory()).getFolloweesCount(request.authToken, request.user),
      "Get followees count successful");
   console.log("In followees count handler after service call");
   return response;
};