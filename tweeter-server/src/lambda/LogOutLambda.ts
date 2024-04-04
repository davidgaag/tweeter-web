import { AuthTokenRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const LogOutHandler = async (event: JSON): Promise<TweeterResponse> => {
   let request: AuthTokenRequest;
   try {
      request = AuthTokenRequest.fromJson(event);
   } catch (error) {
      console.error("LogOutHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   await new UserService(new DynamoDaoFactory()).logout(request.authToken);

   const response = new TweeterResponse(true, "Logged out successfully");
   return response;
};
