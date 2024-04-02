import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const LoginHandler = async (event: LoginRequest): Promise<AuthResponse> => {
   let response = new AuthResponse(
      true,
      ...await new UserService(new DynamoDaoFactory()).login(event.username, event.password),
      "Login successful");

   return response;
};
