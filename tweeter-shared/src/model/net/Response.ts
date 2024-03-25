import { AuthToken } from "../domain/AuthToken";
import { User } from "../domain/User";

export class TweeterResponse {
   private _success: boolean;
   private _message: string | null;

   constructor(success: boolean, message: string | null = null) {
      this._success = success;
      this._message = message;
   }

   get success() {
      return this._success;
   }

   get message() {
      return this._message;
   }
}

interface ResponseJson {
   _success: boolean;
   _message: string;
}

export class AuthResponse extends TweeterResponse {
   _user: User | null;
   _token: AuthToken | null;

   constructor(success: boolean, user: User | null, token: AuthToken | null, message: string | null) {
      super(success, message);
      this._user = user;
      this._token = token;
   }

   get user() {
      return this._user;
   }

   get token() {
      return this._token;
   }

   static fromJson(json: JSON): AuthResponse {
      interface AuthenticateResponseJson extends ResponseJson {
         _user: JSON;
         _token: JSON;
      }

      const jsonObject: AuthenticateResponseJson =
         json as unknown as AuthenticateResponseJson;
      const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

      if (deserializedUser === null) {
         throw new Error(
            "AuthResponse, could not deserialize user with json:\n" +
            JSON.stringify(jsonObject._user)
         );
      }

      const deserializedToken = AuthToken.fromJson(
         JSON.stringify(jsonObject._token)
      );

      if (deserializedToken === null) {
         throw new Error(
            "AuthResponse, could not deserialize token with json:\n" +
            JSON.stringify(jsonObject._token)
         );
      }

      return new AuthResponse(
         jsonObject._success,
         deserializedUser,
         deserializedToken,
         jsonObject._message
      );
   }
}

export class UserCountResponse extends TweeterResponse {
   _count: number;

   constructor(success: boolean, count: number, message: string | null) {
      super(success, message);
      this._count = count;
   }

   get count() {
      return this._count;
   }

   static fromJson(json: JSON): UserCountResponse {
      interface UserCountResponseJson extends ResponseJson {
         _count: number;
      }

      const jsonObject: UserCountResponseJson =
         json as unknown as UserCountResponseJson;

      return new UserCountResponse(
         jsonObject._success,
         jsonObject._count,
         jsonObject._message
      );
   }
}

export class FollowResponse extends TweeterResponse {
   _followersCount: number;
   _followeesCount: number;

   constructor(success: boolean, followersCount: number, followeesCount: number, message: string | null) {
      super(success, message);
      this._followersCount = followersCount;
      this._followeesCount = followeesCount;
   }

   get followersCount() {
      return this._followersCount;
   }

   get followeesCount() {
      return this._followeesCount;
   }

   static fromJson(json: JSON): FollowResponse {
      interface FollowResponseJson extends ResponseJson {
         _followersCount: number;
         _followeesCount: number;
      }

      const jsonObject: FollowResponseJson =
         json as unknown as FollowResponseJson;

      return new FollowResponse(
         jsonObject._success,
         jsonObject._followersCount,
         jsonObject._followeesCount,
         jsonObject._message
      );
   }
}

export class IsFollowerResponse extends TweeterResponse {
   _isFollower: boolean;

   constructor(success: boolean, isFollower: boolean, message: string | null) {
      super(success, message);
      this._isFollower = isFollower;
   }

   get isFollower() {
      return this._isFollower;
   }

   static fromJson(json: JSON): IsFollowerResponse {
      interface IsFollowerResponseJson extends ResponseJson {
         _isFollower: boolean;
      }

      const jsonObject: IsFollowerResponseJson =
         json as unknown as IsFollowerResponseJson;

      return new IsFollowerResponse(
         jsonObject._success,
         jsonObject._isFollower,
         jsonObject._message
      );
   }
}

export class LoadMoreItemsResponse<T> extends TweeterResponse {
   _items: T[];
   _hasMorePages: boolean;

   constructor(success: boolean, items: T[], hasMorePages: boolean, message: string | null) {
      super(success, message);
      this._items = items;
      this._hasMorePages = hasMorePages;
   }

   get items() {
      return this._items;
   }

   get hasMorePages() {
      return this._hasMorePages;
   }

   static fromJson<T>(json: JSON): LoadMoreItemsResponse<T> {
      interface LoadMoreItemsResponseJson<T> extends ResponseJson {
         _items: T[];
         _hasMorePages: boolean;
      }

      const jsonObject: LoadMoreItemsResponseJson<T> =
         json as unknown as LoadMoreItemsResponseJson<T>;

      return new LoadMoreItemsResponse(
         jsonObject._success,
         jsonObject._items,
         jsonObject._hasMorePages,
         jsonObject._message
      );
   }
}