import { LogOutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const LogOutHandler = async (event: JSON): Promise<TweeterResponse> => {
   let request: LogOutRequest;
   try {
      request = LogOutRequest.fromJson(event);
   } catch (error) {
      console.error("LogOutHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   await new UserService().logout(request.authToken);

   const response = new TweeterResponse(true, "Logged out successfully");
   return response;
};
