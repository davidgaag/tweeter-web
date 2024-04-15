import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";
import { sendMessage } from "../model/Sqs";

export const PostStatusHandler = async (event: JSON): Promise<TweeterResponse> => {
   let request: PostStatusRequest;
   try {
      request = PostStatusRequest.fromJson(event);
   } catch (error) {
      console.error("PostStatusHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   await new StatusService(new DynamoDaoFactory()).postStatusToStory(request.authToken, request.newStatus);
   // Send message to SQS
   const sqs_url = "https://sqs.us-east-2.amazonaws.com/533267155110/NewStatusQueue";
   await sendMessage(sqs_url, request.newStatus.toJson());
   let response = new TweeterResponse(
      true,
      "Status posted successfully"
   );
   return response;
};
