import { AuthToken } from "../domain/AuthToken";
import { User } from "../domain/User";

export class TweeterRequest {
   // TODO: authToken?
}

export class LoginRequest extends TweeterRequest {
   username: string;
   password: string;

   constructor(username: string, password: string) {
      super();
      this.username = username;
      this.password = password;
   }
}

export class RegisterRequest extends TweeterRequest {
   firstName: string;
   lastName: string;
   alias: string;
   password: string;
   imageStringBase64: string;

   constructor(firstName: string, lastName: string, alias: string, password: string, imageBytes: string) {
      super();
      this.firstName = firstName;
      this.lastName = lastName;
      this.alias = alias;
      this.password = password;
      this.imageStringBase64 = imageBytes;
   }
}

export class UserRequest extends TweeterRequest {
   authToken: AuthToken;
   user: User;

   constructor(authToken: AuthToken, user: User) {
      super();
      this.authToken = authToken;
      this.user = user;
   }
}