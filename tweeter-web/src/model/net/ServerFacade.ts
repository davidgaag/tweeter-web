import { AuthResponse, LoginRequest } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { RegisterRequest } from "tweeter-shared/dist/model/net/Request";

export class ServerFacade {

   private SERVER_URL = "https://7u1ptwdfjb.execute-api.us-east-2.amazonaws.com/beta"; // TODO: Set this value.

   private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

   async login(request: LoginRequest): Promise<AuthResponse> {
      const endpoint = "/service/login";
      const response: JSON = await this.clientCommunicator.doPost<LoginRequest>(request, endpoint);

      return AuthResponse.fromJson(response);
   }

   async register(request: RegisterRequest): Promise<AuthResponse> {
      const endpoint = "/service/register";
      const response: JSON = await this.clientCommunicator.doPost<RegisterRequest>(request, endpoint);

      return AuthResponse.fromJson(response);
   }
}