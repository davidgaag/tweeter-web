import { AuthToken, User, LoginRequest, RegisterRequest, GetUserRequest, LogOutRequest } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../net/ServerFacade";

export class UserService {
   private serverFacade = new ServerFacade();

   public async getUser(
      authToken: AuthToken,
      alias: string
   ): Promise<User | null> {
      const response = await this.serverFacade.getUser(new GetUserRequest(authToken, alias));
      return response.user;
   };

   public async login(
      alias: string,
      password: string
   ): Promise<[User, AuthToken]> {
      const response = await this.serverFacade.login(new LoginRequest(alias, password));
      return [response.user, response.token];
   };

   public async register(
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageBytes: Uint8Array
   ): Promise<[User, AuthToken]> {
      let imageStringBase64: string =
         Buffer.from(userImageBytes).toString("base64");

      const response = await this.serverFacade.register(new RegisterRequest(
         firstName,
         lastName,
         alias,
         password,
         imageStringBase64
      ));

      return [response.user, response.token];
   };

   public async logout(authToken: AuthToken): Promise<void> {
      await this.serverFacade.logout(new LogOutRequest(authToken));
   };
}