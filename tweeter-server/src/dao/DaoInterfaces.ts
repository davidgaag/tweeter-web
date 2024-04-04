import { AuthToken, Status, User } from "tweeter-shared";
import { DataPage } from "../model/DataPage";

export interface DaoFactory {
   getUserDao: () => UserDaoInterface;
   getImageDao: () => ImageDaoInterface;
   getAuthTokenDao: () => AuthTokenDaoInterface;
   getFollowsDao: () => FollowsDaoInterface;
   getStatusDao: () => StatusDaoInterface;
   // TODO: remaining DAO interfaces
}

export interface UserDaoInterface {
   getUserByAlias(alias: string): Promise<[User, string] | undefined>;
   getUsersByAlias(aliases: string[]): Promise<User[]>;
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
   getMoreFollowers(alias: string, pageSize: number | null, lastAlias: string | null): Promise<DataPage<string>>;
   getMoreFollowees(alias: string, pageSize: number | null, lastAlias: string | null): Promise<DataPage<string>>;
   getFollowingStatus(followerAlias: string, followeeAlias: string): Promise<boolean>;
   putFollow(followerAlias: string, followeeAlias: string): Promise<boolean>;
   deleteFollow(followerAlias: string, followeeAlias: string): Promise<boolean>;
}

export interface StatusDaoInterface {
   getMoreStoryItems(userAlias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>>;
   getMoreFeedItems(userAlias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>>;
   putStatusInStory(status: Status): Promise<void>;
   putStatusInFeeds(status: Status, followerAliases: string[]): Promise<void>;
}
