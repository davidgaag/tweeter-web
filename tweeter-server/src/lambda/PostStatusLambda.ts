import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";

export const PostStatusHandler = async (event: JSON): Promise<TweeterResponse> => {
   let request: PostStatusRequest;
   try {
      request = PostStatusRequest.fromJson(event);
   } catch (error) {
      console.error("PostStatusHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   await new StatusService().postStatus(request.authToken, request.newStatus);

   let response = new TweeterResponse(
      true,
      "Status posted successfully"
   );
   return response;
};