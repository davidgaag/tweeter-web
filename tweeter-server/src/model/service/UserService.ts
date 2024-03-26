import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
   public async getUser(
      authToken: AuthToken,
      alias: string
   ): Promise<User | null> {
      // TODO: M4 real data
      return FakeData.instance.findUserByAlias(alias);
   };

   public async login(
      alias: string,
      password: string
   ): Promise<[User, AuthToken]> {
      // TODO: M4 real data
      let user = FakeData.instance.firstUser;

      if (user === null) {
         throw new Error("Invalid alias or password");
      }

      return [user, FakeData.instance.authToken];
   };

   public async register(
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageStringBase64: string
   ): Promise<[User, AuthToken]> {
      // TODO: M4 real data
      let user = FakeData.instance.firstUser;

      // TODO: Error handling for bad registration, etc.
      if (user === null) {
         throw new Error("Invalid registration");
      }

      return [user, FakeData.instance.authToken];
   };

   public async logout(authToken: AuthToken): Promise<void> {
      // TODO: M4
      console.log("I would have logged out if I were connected to the server.");
   };
}