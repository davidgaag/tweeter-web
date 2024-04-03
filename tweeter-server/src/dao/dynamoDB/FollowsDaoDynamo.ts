import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FollowsDaoInterface } from "../DaoInterfaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../../model/DataPage";

export class FollowsDaoDynamo implements FollowsDaoInterface {
   readonly tableName = "follows";
   readonly indexName = "follows_index";
   readonly followerHandleAttr = "follower_handle";
   // readonly followerNameAttr = "follower_name";
   readonly followeeHandleAttr = "followee_handle";
   // readonly followeeNameAttr = "followee_name";

   private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

   public async getMoreFollowers(userAlias: string, pageSize: number, lastAlias: string | null): Promise<DataPage<string>> {
      return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followeeHandleAttr, true);
   }

   public async getMoreFollowees(userAlias: string, pageSize: number, lastAlias: string | null): Promise<DataPage<string>> {
      return await this.getMoreFollows(userAlias, pageSize, lastAlias, this.followerHandleAttr, false);
   }

   public async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
      const params = {
         TableName: this.tableName,
         Item: this.generateFollowItem(followerAlias, followeeAlias)
      };
      await this.client.send(new PutCommand(params));
   }

   public async deleteFollow(followerAlias: string, followeeAlias: string): Promise<void> {
      const params = {
         TableName: this.tableName,
         Key: this.generateFollowItem(followerAlias, followeeAlias)
      };
      await this.client.send(new DeleteCommand(params));
   }

   public async getFollowingStatus(followerAlias: string, followeeAlias: string): Promise<boolean> {
      const params = {
         TableName: this.tableName,
         Key: this.generateFollowItem(followerAlias, followeeAlias)
      };
      const data = await this.client.send(new GetCommand(params));
      return data.Item !== undefined;
   }

   private async getMoreFollows(
      userAlias: string,
      pageSize: number,
      lastAlias: string | null,
      attributeName: string,
      useIndex: boolean): Promise<DataPage<string>> {
      const params: {
         KeyConditionExpression: string;
         ExpressionAttributeValues: { [key: string]: string };
         TableName: string;
         Limit: number;
         ExclusiveStartKey?: { [key: string]: string };
         IndexName?: string;
      } = {
         KeyConditionExpression: attributeName + " = :userAlias",
         ExpressionAttributeValues: {
            ":userAlias": userAlias,
         },
         TableName: this.tableName,
         Limit: pageSize,
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

      const aliases: string[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => aliases.push(item[this.followerHandleAttr]));
      return new DataPage(aliases, hasMorePages);
   }

   private generateFollowItem(followerAlias: string, followeeAlias: string) {
      return {
         [this.followerHandleAttr]: followerAlias,
         [this.followeeHandleAttr]: followeeAlias
      };
   }
}