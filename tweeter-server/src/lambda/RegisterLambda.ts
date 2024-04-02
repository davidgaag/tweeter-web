import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const RegisterHandler = async (event: JSON): Promise<AuthResponse> => {
   let request: RegisterRequest;
   try {
      request = RegisterRequest.fromJson(event);
   } catch (error) {
      throw new Error("[Bad Request] Invalid request");
   }

   let response = new AuthResponse(
      true,
      ...await new UserService(new DynamoDaoFactory()).register(
         request.firstName,
         request.lastName,
         request.alias,
         request.password,
         request.imageStringBase64
      ),
      "Registration successful");
   return response;
};
