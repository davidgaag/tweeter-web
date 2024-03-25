import { AuthToken, User, FakeData, LoginRequest, RegisterRequest } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../net/ServerFacade";

export class UserService {
   private serverFacade = new ServerFacade();

   public async getUser(
      authToken: AuthToken,
      alias: string
   ): Promise<User | null> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.findUserByAlias(alias);
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
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      await new Promise((res) => setTimeout(res, 1000));
   };
}