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
}

export class UserRequest extends TweeterRequest {
   private _authToken: AuthToken;
   private _user: User;

   constructor(authToken: AuthToken, user: User) {
      super();
      this._authToken = authToken;
      this._user = user;
   }

   get authToken() {
      return this._authToken;
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
      const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._authToken));
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

      if (deserializedToken === null) {
         throw new Error(
            "UserRequest, could not deserialize token with json:\n" +
            JSON.stringify(jsonObject._authToken)
         );
      }

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

export class IsFollowerRequest extends UserRequest {
   private _selectedUser: User;

   constructor(authToken: AuthToken, user: User, selectedUser: User) {
      super(authToken, user);
      this._selectedUser = selectedUser;
   }

   get selectedUser() {
      return this._selectedUser;
   }

   static fromJson(json: JSON): IsFollowerRequest {
      interface IsFollowerRequestJson {
         _authToken: AuthToken;
         _user: User;
         _selectedUser: User;
      }

      const jsonObject: IsFollowerRequestJson = json as unknown as IsFollowerRequestJson;
      const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._authToken));
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
      const deserializedSelectedUser = User.fromJson(JSON.stringify(jsonObject._selectedUser));

      if (deserializedToken === null) {
         throw new Error(
            "IsFollowerRequest, could not deserialize token with json:\n" +
            JSON.stringify(jsonObject._authToken)
         );
      }

      if (deserializedUser === null) {
         throw new Error(
            "IsFollowerRequest, could not deserialize user with json:\n" +
            JSON.stringify(jsonObject._user)
         );
      }

      if (deserializedSelectedUser === null) {
         throw new Error(
            "IsFollowerRequest, could not deserialize selected user with json:\n" +
            JSON.stringify(jsonObject._selectedUser)
         );
      }

      return new IsFollowerRequest(
         deserializedToken,
         deserializedUser,
         deserializedSelectedUser
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
      console.log(JSON.stringify(jsonObject));
      console.log(jsonObject);
      const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._authToken));
      console.log("Deserialized token: ", deserializedToken);
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
      console.log("Deserialized user: ", deserializedUser);
      let deserializedLastItem: User | null;
      if (jsonObject._lastItem !== null) {
         deserializedLastItem = User.fromJson(JSON.stringify(jsonObject._lastItem));
      } else {
         deserializedLastItem = null;
      }
      console.log("Deserialized last item: ", deserializedLastItem);

      if (deserializedToken === null) {
         throw new Error(
            "LoadMoreItemsRequest, could not deserialize token with json:\n" +
            JSON.stringify(jsonObject._authToken)
         );
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

      const jsonObject: LoadMoreItemsRequestJson = json as unknown as LoadMoreItemsRequestJson;
      const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._authToken));
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));
      const deserializedLastItem = Status.fromJson(JSON.stringify(jsonObject._lastItem));

      if (deserializedToken === null) {
         throw new Error(
            "LoadMoreItemsRequest, could not deserialize token with json:\n" +
            JSON.stringify(jsonObject._authToken)
         );
      }

      if (deserializedUser === null) {
         throw new Error(
            "LoadMoreItemsRequest, could not deserialize user with json:\n" +
            JSON.stringify(jsonObject._user)
         );
      }

      if (deserializedLastItem === null) {
         throw new Error(
            "LoadMoreItemsRequest, could not deserialize last item with json:\n" +
            JSON.stringify(jsonObject._lastItem)
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