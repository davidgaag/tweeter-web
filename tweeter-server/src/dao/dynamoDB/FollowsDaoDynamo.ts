import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FollowsDaoInterface } from "../DaoInterfaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../../model/DataPage";
import { client } from "./DynamoDaoFactory";

class ConditionalCheckFailedException extends Error {
   constructor(message?: string) {
      super(message);
      this.name = "ConditionalCheckFailedException";
   }
}

export class FollowsDaoDynamo implements FollowsDaoInterface {
   readonly tableName = "follows";
   readonly indexName = "followee_handle-follower_handle-index";
   readonly followerHandleAttr = "follower_handle";
   // readonly followerNameAttr = "follower_name";
   readonly followeeHandleAttr = "followee_handle";
   // readonly followeeNameAttr = "followee_name";

   public async getMoreFollowers(userAlias: string, pageSize: number | null, lastAlias: string | null): Promise<DataPage<string>> {
      return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followeeHandleAttr, true);
   }

   public async getMoreFollowees(userAlias: string, pageSize: number | null, lastAlias: string | null): Promise<DataPage<string>> {
      return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followerHandleAttr, false);
   }

   public async putFollow(followerAlias: string, followeeAlias: string): Promise<boolean> {
      const params = {
         TableName: this.tableName,
         Item: this.generateFollowItem(followerAlias, followeeAlias),
         ConditionExpression: "attribute_not_exists(follower_handle) AND attribute_not_exists(followee_handle)"
      };

      try {
         await client.send(new PutCommand(params));
      } catch (error) {
         if (error instanceof ConditionalCheckFailedException) {
            return false;
         }
         throw error;
      }
      return true;
   }

   public async deleteFollow(followerAlias: string, followeeAlias: string): Promise<boolean> {
      const params = {
         TableName: this.tableName,
         Key: this.generateFollowItem(followerAlias, followeeAlias),
         ConditionExpression: "attribute_exists(follower_handle) AND attribute_exists(followee_handle)"
      };
      try {
         await client.send(new DeleteCommand(params));
      } catch (error) {
         if (error instanceof ConditionalCheckFailedException) {
            return false;
         }
         throw error;
      }
      return true;
   }

   public async getFollowingStatus(followerAlias: string, followeeAlias: string): Promise<boolean> {
      const params = {
         TableName: this.tableName,
         Key: this.generateFollowItem(followerAlias, followeeAlias)
      };
      const data = await client.send(new GetCommand(params));
      return data.Item !== undefined;
   }

   private async getMoreFollows(
      userAlias: string,
      pageSize: number | null,
      lastAlias: string | null,
      attributeName: string,
      useIndex: boolean): Promise<DataPage<string>> {
      let sortKeyAttribute: string;
      if (attributeName === this.followerHandleAttr) {
         sortKeyAttribute = this.followeeHandleAttr;
      } else {
         sortKeyAttribute = this.followerHandleAttr;
      }

      const params: {
         KeyConditionExpression: string;
         ExpressionAttributeValues: { [key: string]: string };
         TableName: string;
         Limit?: number;
         ExclusiveStartKey?: { [key: string]: string };
         IndexName?: string;
      } = {
         KeyConditionExpression: attributeName + " = :userAlias",
         ExpressionAttributeValues: {
            ":userAlias": userAlias,
         },
         TableName: this.tableName,
         ExclusiveStartKey:
            lastAlias === null
               ? undefined
               : {
                  [this.followerHandleAttr]: lastAlias,
                  [this.followeeHandleAttr]: userAlias,
               },
      };

      if (useIndex) {
         params.IndexName = this.indexName;
      }

      if (pageSize !== null) {
         params.Limit = pageSize;
      }

      const aliases: string[] = [];
      const data = await client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => aliases.push(item[sortKeyAttribute]));
      return new DataPage(aliases, hasMorePages);
   }

   private generateFollowItem(followerAlias: string, followeeAlias: string) {
      return {
         [this.followerHandleAttr]: followerAlias,
         [this.followeeHandleAttr]: followeeAlias
      };
   }
}