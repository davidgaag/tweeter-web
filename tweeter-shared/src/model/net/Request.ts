import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterRequest { }

export class LoginRequest extends TweeterRequest {
   private _username: string;
   private _password: string;

   constructor(username: string, password: string) {
      super();
      this._username = username;
      this._password = password;
   }

   get username() {
      return this._username;
   }

   get password() {
      return this._password;
   }

   static fromJson(json: JSON): LoginRequest {
      interface LoginRequestJson {
         _username: string;
         _password: string;
      }

      const jsonObject: LoginRequestJson = json as unknown as LoginRequestJson;
      return new LoginRequest(
         jsonObject._username,
         jsonObject._password
      );
   }
}

export class RegisterRequest extends TweeterRequest {
   private _firstName: string;
   private _lastName: string;
   private _alias: string;
   private _password: string;
   private _imageStringBase64: string;

   constructor(firstName: string, lastName: string, alias: string, password: string, imageBytes: string) {
      super();
      this._firstName = firstName;
      this._lastName = lastName;
      this._alias = alias;
      this._password = password;
      this._imageStringBase64 = imageBytes;
   }

   get firstName() {
      return this._firstName;
   }

   get lastName() {
      return this._lastName;
   }

   get alias() {
      return this._alias;
   }

   get password() {
      return this._password;
   }

   get imageStringBase64() {
      return this._imageStringBase64;
   }

   static fromJson(json: JSON): RegisterRequest {
      interface RegisterRequestJson {
         _firstName: string;
         _lastName: string;
         _alias: string;
         _password: string;
         _imageStringBase64: string;
      }

      const jsonObject: RegisterRequestJson = json as unknown as RegisterRequestJson;
      return new RegisterRequest(
         jsonObject._firstName,
         jsonObject._lastName,
         jsonObject._alias,
         jsonObject._password,
         jsonObject._imageStringBase64
      );
   }
}

export class AuthTokenRequest extends TweeterRequest {
   private _authToken: AuthToken;

   constructor(authToken: AuthToken) {
      super();
      this._authToken = authToken;
   }

   get authToken() {
      return this._authToken;
   }

   static fromJson(json: JSON) {
      interface AuthTokenRequestJson {
         _authToken: AuthToken;
      }

      const jsonObject: AuthTokenRequestJson = json as unknown as AuthTokenRequestJson;
      const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._authToken));

      if (deserializedToken === null) {
         throw new Error(
            "AuthTokenRequest, could not deserialize token with json:\n" +
            JSON.stringify(jsonObject._authToken)
         );
      }
      return new AuthTokenRequest(deserializedToken);
   }

}

export class UserRequest extends AuthTokenRequest {
   private _user: User;

   constructor(authToken: AuthToken, user: User) {
      super(authToken);
      this._user = user;
   }

   get user() {
      return this._user;
   }

   static fromJson(json: JSON): UserRequest {
      interface UserRequestJson {
         _authToken: AuthToken;
         _user: User;
      }

      const jsonObject: UserRequestJson = json as unknown as UserRequestJson;
      const deserializedToken = AuthTokenRequest.fromJson(json).authToken;
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

      if (deserializedUser === null) {
         throw new Error(
            "UserRequest, could not deserialize user with json:\n" +
            JSON.stringify(jsonObject._user)
         );
      }

      return new UserRequest(
         deserializedToken,
         deserializedUser
      );
   }
}

export class LoadMoreItemsRequest<T> extends UserRequest {
   _pageSize: number;
   _lastItem: T | null;

   constructor(authToken: AuthToken, user: User, pageSize: number, lastItem: T | null) {
      super(authToken, user);
      this._pageSize = pageSize;
      this._lastItem = lastItem;
   }

   get pageSize() {
      return this._pageSize;
   }

   get lastItem() {
      return this._lastItem;
   }

   static usersFromJson(json: JSON): LoadMoreItemsRequest<User> {
      interface LoadMoreItemsRequestJson {
         _authToken: AuthToken;
         _user: User;
         _pageSize: number;
         _lastItem: User | null;
      }

      const jsonObject: LoadMoreItemsRequestJson = json as unknown as LoadMoreItemsRequestJson;
      const deserializedToken = AuthTokenRequest.fromJson(json).authToken;
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
      let deserializedLastItem: User | null;
      if (jsonObject._lastItem !== null) {
         deserializedLastItem = User.fromJson(JSON.stringify(jsonObject._lastItem));
      } else {
         deserializedLastItem = null;
      }

      if (deserializedUser === null) {
         throw new Error(
            "LoadMoreItemsRequest, could not deserialize user with json:\n" +
            JSON.stringify(jsonObject._user)
         );
      }

      return new LoadMoreItemsRequest(
         deserializedToken,
         deserializedUser,
         jsonObject._pageSize,
         deserializedLastItem
      );
   }

   static statusesFromJson(json: JSON): LoadMoreItemsRequest<Status> {
      interface LoadMoreItemsRequestJson {
         _authToken: AuthToken;
         _user: User;
         _pageSize: number;
         _lastItem: Status | null;
      }

      // TODO: delete log statements
      const jsonObject: LoadMoreItemsRequestJson = json as unknown as LoadMoreItemsRequestJson;
      const deserializedToken = AuthTokenRequest.fromJson(json).authToken;
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
      let deserializedLastItem: Status | null;
      if (jsonObject._lastItem !== null) {
         deserializedLastItem = Status.fromJson(JSON.stringify(jsonObject._lastItem));
      } else {
         deserializedLastItem = null;
      }

      if (deserializedUser === null) {
         throw new Error(
            "LoadMoreItemsRequest, could not deserialize user with json:\n" +
            JSON.stringify(jsonObject._user)
         );
      }

      return new LoadMoreItemsRequest(
         deserializedToken,
         deserializedUser,
         jsonObject._pageSize,
         deserializedLastItem
      );
   }
}

export class PostStatusRequest extends AuthTokenRequest {
   private _newStatus: Status;

   constructor(authToken: AuthToken, newStatus: Status) {
      super(authToken);
      this._newStatus = newStatus;
   }

   get newStatus() {
      return this._newStatus;
   }

   static fromJson(json: JSON): PostStatusRequest {
      interface PostStatusRequestJson {
         _authToken: AuthToken;
         _newStatus: Status;
      }

      const jsonObject: PostStatusRequestJson = json as unknown as PostStatusRequestJson;
      const deserializedToken = AuthTokenRequest.fromJson(json).authToken;
      const deserializedStatus = Status.fromJson(JSON.stringify(jsonObject._newStatus));

      if (deserializedStatus === null) {
         throw new Error(
            "PostStatusRequest, could not deserialize status with json:\n" +
            JSON.stringify(jsonObject._newStatus)
         );
      }

      return new PostStatusRequest(
         deserializedToken,
         deserializedStatus
      );
   }
}

export class GetUserRequest extends AuthTokenRequest {
   private _alias: string;

   constructor(authToken: AuthToken, alias: string) {
      super(authToken);
      this._alias = alias;
   }

   get alias() {
      return this._alias;
   }

   static fromJson(json: JSON): GetUserRequest {
      interface GetUserRequestJson {
         _authToken: AuthToken;
         _alias: string;
      }

      const jsonObject: GetUserRequestJson = json as unknown as GetUserRequestJson;
      const deserializedToken = AuthTokenRequest.fromJson(json).authToken;

      return new GetUserRequest(
         deserializedToken,
         jsonObject._alias
      );
   }
}
