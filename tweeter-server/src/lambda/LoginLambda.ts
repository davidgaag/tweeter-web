import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: LoginRequest): Promise<AuthResponse> => {
   let response = new AuthResponse(...await new UserService().login(event.username, event.password));
   return response;
};
