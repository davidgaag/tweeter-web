import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DaoFactory } from "../DaoInterfaces";
import { AuthTokenDaoDynamo } from "./AuthTokenDaoDynamo";
import { FollowsDaoDynamo } from "./FollowsDaoDynamo";
import { ImageDaoS3 } from "./ImageDaoS3";
import { UserDaoDynamo } from "./UserDaoDynamo";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { StatusDaoDynamo } from "./StatusDaoDynamo";

export const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export const createTimeStamp = () => Math.floor(new Date().getTime() / 1000);


export class DynamoDaoFactory implements DaoFactory {
   public getUserDao() { return new UserDaoDynamo(); }
   public getImageDao() { return new ImageDaoS3(); }
   public getAuthTokenDao() { return new AuthTokenDaoDynamo(); }
   public getFollowsDao() { return new FollowsDaoDynamo(); }
   public getStatusDao() { return new StatusDaoDynamo(); }
}