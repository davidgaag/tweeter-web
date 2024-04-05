import { DeleteCommand, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FollowsDaoInterface } from "../DaoInterfaces";
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
      return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followeeHandleAttr);
   }

   public async getMoreFollowees(userAlias: string, pageSize: number | null, lastAlias: string | null): Promise<DataPage<string>> {
      return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followerHandleAttr);
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
      attributeName: string
   ): Promise<DataPage<string>> {
      let sortKeyAttribute: string;
      let useIndex: boolean;
      if (attributeName === this.followerHandleAttr) { // getMoreFollowees
         sortKeyAttribute = this.followeeHandleAttr;
         useIndex = false;
      } else { // getMoreFollowers
         sortKeyAttribute = this.followerHandleAttr;
         useIndex = true;
      }

      console.log("attributeName: ", attributeName, userAlias)
      console.log("sortKeyAttribute: ", sortKeyAttribute, lastAlias)
      console.log("useIndex: ", useIndex)

      const params: {
         KeyConditionExpression: string;
         ExpressionAttributeValues: { [key: string]: string };
         TableName: string;
         ScanIndexForward: boolean;
         Limit?: number;
         ExclusiveStartKey?: { [key: string]: string };
         IndexName?: string;
      } = {
         KeyConditionExpression: attributeName + " = :userAlias",
         ExpressionAttributeValues: {
            ":userAlias": userAlias,
         },
         TableName: this.tableName,
         ScanIndexForward: true,
         ExclusiveStartKey:
            lastAlias === null
               ? undefined
               : {
                  [attributeName]: userAlias,
                  [sortKeyAttribute]: lastAlias,
               },
      };

      if (useIndex) {
         params.IndexName = this.indexName;
      }

      if (pageSize !== null) {
         params.Limit = pageSize;
      }

      console.log("params: ", params);

      const aliases: string[] = [];
      const data = await client.send(new QueryCommand(params));
      console.log("data: ", data)
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => aliases.push(item[sortKeyAttribute]));
      console.log("aliases after mapping items: ", aliases)
      return new DataPage(aliases, hasMorePages);
   }

   private generateFollowItem(followerAlias: string, followeeAlias: string) {
      return {
         [this.followerHandleAttr]: followerAlias,
         [this.followeeHandleAttr]: followeeAlias
      };
   }
}