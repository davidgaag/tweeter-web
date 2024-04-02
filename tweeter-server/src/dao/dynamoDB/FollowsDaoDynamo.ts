import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { FollowsDaoInterface } from "../DaoInterfaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follow } from "tweeter-shared";

export class FollowsDaoDynamo implements FollowsDaoInterface {
   readonly tableName = "follows";
   readonly indexName = "follows_index";
   readonly followerHandleAttr = "followerHandle";
   // readonly followerNameAttr = "follower_name";
   readonly followeeHandleAttr = "followeeHandle";
   // readonly followeeNameAttr = "followee_name";

   private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

   public async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
      const params = {
         TableName: this.tableName,
         Item: this.generateFollowItem(followerAlias, followeeAlias)
      };
      await this.client.send(new PutCommand(params));
   }

   private generateFollowItem(followerAlias: string, followeeAlias: string) {
      return {
         [this.followerHandleAttr]: followerAlias,
         [this.followeeHandleAttr]: followeeAlias
      };
   }
}