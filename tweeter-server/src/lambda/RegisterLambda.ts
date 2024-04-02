import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const RegisterHandler = async (event: RegisterRequest): Promise<AuthResponse> => {
   let response = new AuthResponse(
      true,
      ...await new UserService(new DynamoDaoFactory()).register(
         event.firstName,
         event.lastName,
         event.alias,
         event.password,
         event.imageStringBase64
      ),
      "Registration successful");
   return response;
};
