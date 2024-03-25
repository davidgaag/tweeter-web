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

}