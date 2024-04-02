import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const LoginHandler = async (event: JSON): Promise<AuthResponse> => {
   let request: LoginRequest;
   try {
      request = LoginRequest.fromJson(event);
   } catch (error) {
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new AuthResponse(
      true,
      ...await new UserService(new DynamoDaoFactory()).login(request.username, request.password),
      "Login successful");

   return response;
};
