import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
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

      // TODO: API Gateway error handling
      if (user === null) {
         throw new Error("Invalid registration");
      }

      return [user, FakeData.instance.authToken];
   };
}