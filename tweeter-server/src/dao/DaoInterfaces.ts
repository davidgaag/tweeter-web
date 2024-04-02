import { User } from "tweeter-shared";

export interface DaoFactory {
   getUserDao: () => UserDaoInterface;
   getImageDao: () => ImageDaoInterface;
   getAuthTokenDao: () => AuthTokenDaoInterface;
   getFollowsDao: () => FollowsDaoInterface;
   // TODO: remaining DAO interfaces
}

export interface UserDaoInterface {
   getUserByAlias(alias: string): Promise<User | undefined>;
   putUser(firstName: string, lastName: string, alias: string, imageUrl: string, hashedPassword: string): Promise<void>;
}

export interface ImageDaoInterface {
   putImage(imageStringBase64: string, alias: string): Promise<string>;
}

export interface AuthTokenDaoInterface {
   putAuthToken(token: string, alias: string): Promise<void>;
}

export interface FollowsDaoInterface {

}


