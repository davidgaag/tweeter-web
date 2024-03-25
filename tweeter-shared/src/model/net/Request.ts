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