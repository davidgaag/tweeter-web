import { AuthToken } from "../domain/AuthToken";
import { User } from "../domain/User";

export class TweeterRequest { }

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
   selectedUser: User;

   constructor(authToken: AuthToken, user: User, selectedUser: User) {
      super(authToken, user);
      this.selectedUser = selectedUser;
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
   pageSize: number;
   lastItem: T | null;

   constructor(authToken: AuthToken, user: User, pageSize: number, lastItem: T | null) {
      super(authToken, user);
      this.pageSize = pageSize;
      this.lastItem = lastItem;
   }
}