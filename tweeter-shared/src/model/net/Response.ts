// TODO: extends/implements superclass/interface?

import { AuthToken } from "../domain/AuthToken";
import { User } from "../domain/User";

export class AuthResponse {
   user: User;
   token: AuthToken;

   constructor(user: User, token: AuthToken) {
      this.user = user;
      this.token = token;
   }
}