import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const GetUserHandler = async (event: JSON): Promise<GetUserResponse> => {
   let request: GetUserRequest;
   try {
      request = GetUserRequest.fromJson(event);
   } catch (error) {
      console.error("GetUserHandler, error parsing request: " + error);
      throw new Error("[Bad Request] Invalid request");
   }

   const user = await new UserService(new DynamoDaoFactory()).getUser(request.authToken, request.alias);
   if (user === null) {
      throw new Error("[Not Found] User not found");
   }

   // TODO: M4 error handling?
   let response = new GetUserResponse(
      true,
      user,
      "Get user successful"
   );
   return response;
}