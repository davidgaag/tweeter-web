import { DaoFactory, UserDaoInterface } from "../DaoInterfaces";
import { AuthTokenDaoDynamo } from "./AuthTokenDaoDynamo";
import { FollowsDaoDynamo } from "./FollowsDaoDynamo";
import { ImageDaoS3 } from "./ImageDaoS3";
import { UserDaoDynamo } from "./UserDaoDynamo";

export class DynamoDaoFactory implements DaoFactory {
   public getUserDao() { return new UserDaoDynamo(); }
   public getImageDao() { return new ImageDaoS3(); }
   public getAuthTokenDao() { return new AuthTokenDaoDynamo(); }
   public getFollowsDao() { return new FollowsDaoDynamo(); }
}