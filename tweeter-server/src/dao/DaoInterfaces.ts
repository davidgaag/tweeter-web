import { AuthToken, User } from "tweeter-shared";

export interface DaoFactory {
   getUserDao: () => UserDaoInterface;
   getImageDao: () => ImageDaoInterface;
   getAuthTokenDao: () => AuthTokenDaoInterface;
   getFollowsDao: () => FollowsDaoInterface;
   // TODO: remaining DAO interfaces
}

export interface UserDaoInterface {
   getUserByAlias(alias: string): Promise<[User, string] | undefined>;
   putUser(firstName: string, lastName: string, alias: string, imageUrl: string, hashedPassword: string): Promise<void>;
   getNumFollowers(alias: string): Promise<number | undefined>;
   getNumFollowees(alias: string): Promise<number | undefined>;
   incrementFollowers(alias: string): Promise<number | undefined>;
   decrementFollowers(alias: string): Promise<number | undefined>;
   incrementFollowees(alias: string): Promise<number | undefined>;
   decrementFollowees(alias: string): Promise<number | undefined>;
}

export interface ImageDaoInterface {
   putImage(imageStringBase64: string, alias: string): Promise<string>;
}

export interface AuthTokenDaoInterface {
   putAuthToken(token: AuthToken, alias: string): Promise<void>;
   // checkAuthToken(token: AuthToken): Promise<boolean>;
   getAssociatedAlias(token: AuthToken): Promise<string | undefined>; // TODO: necessary?
   updateTokenExpiration(token: AuthToken): Promise<void>;
   deleteAuthToken(token: AuthToken): Promise<void>;
}

export interface FollowsDaoInterface {
   putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
}


