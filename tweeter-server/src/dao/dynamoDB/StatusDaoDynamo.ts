import { Status, User } from "tweeter-shared";
import { StatusDaoInterface } from "../DaoInterfaces";
import { BatchWriteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client, createTimeStamp } from "./DynamoDaoFactory";
import { DataPage } from "../../model/DataPage";

export class StatusDaoDynamo implements StatusDaoInterface {
   private readonly storyTableName = "story";
   private readonly authorAttr = "author";

   private readonly feedTableName = "feed";
   private readonly feedOwnerAttr = "feedOwner";

   // Shared/common attributes
   private readonly contentAttr = "content";
   private readonly createdAtAttr = "createdAt";

   public async getMoreStoryItems(userAlias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>> {
      return await this.getMoreStatuses(this.storyTableName, userAlias, pageSize, lastItem);
   }

   public async getMoreFeedItems(userAlias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>> {
      return await this.getMoreStatuses(this.feedTableName, userAlias, pageSize, lastItem);
   }

   public async putStatusInStory(status: Status): Promise<void> {
      const params = {
         TableName: this.storyTableName,
         Item: this.createStoryItem(status)
      };
      await client.send(new PutCommand(params));
   }

   public async putStatusInFeeds(status: Status, followerAliases: string[]): Promise<void> {
      const items = followerAliases.map(followerAlias => this.createFeedItem(status, followerAlias));
      for (let i = 0; i < items.length; i += 25) {
         const params = {
            RequestItems: {
               [this.feedTableName]: items.slice(i, i + 25).map(item => ({
                  PutRequest: {
                     Item: item
                  }
               }))
            }
         };
         try {
            await client.send(new BatchWriteCommand(params));
         } catch (error) {
            console.error("Failed to put status in feeds IN DAO because of exception: ", error);
            throw error;
         }
      }
   }

   private async getMoreStatuses(tableName: string, userAlias: string, pageSize: number, lastItem: Status | null): Promise<DataPage<Status>> {
      let attrToMatch: string;
      if (tableName == this.storyTableName) {
         attrToMatch = this.authorAttr;
      } else {
         attrToMatch = this.feedOwnerAttr;
      }

      const params = {
         TableName: tableName,
         KeyConditionExpression: `${attrToMatch} = :alias`,
         ExpressionAttributeValues: {
            ":alias": userAlias
         },
         Limit: pageSize,
         ScanIndexForward: false,
         ExclusiveStartKey:
            lastItem === null
               ? undefined
               : {
                  [attrToMatch]: userAlias,
                  [this.createdAtAttr]: lastItem.timestamp
               }
      };
      const statuses: Status[] = [];
      const data = await client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
         statuses.push(new Status(
            item[this.contentAttr],
            new User("tempFirstName", "tempLastName", item[this.authorAttr], "tempUrl"),
            item[this.createdAtAttr]
         ));
      });
      return new DataPage(statuses, hasMorePages);
   }

   private createStoryItem(status: Status) {
      return {
         [this.authorAttr]: status.user.alias,
         [this.createdAtAttr]: status.timestamp,
         [this.contentAttr]: status.post
      }
   }

   private createFeedItem(status: Status, followerAlias: string) {
      return {
         [this.feedOwnerAttr]: followerAlias,
         [this.authorAttr]: status.user.alias,
         [this.createdAtAttr]: status.timestamp,
         [this.contentAttr]: status.post
      }
   }
}