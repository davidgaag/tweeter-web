import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const LoginHandler = async (event: LoginRequest): Promise<AuthResponse> => {
   let response = new AuthResponse(true, ...await new UserService().login(event.username, event.password), "Login successful");
   return response;
};
