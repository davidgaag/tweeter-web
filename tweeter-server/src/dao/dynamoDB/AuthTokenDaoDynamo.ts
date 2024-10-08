import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDaoInterface } from "../DaoInterfaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";
import { client, createTimeStamp } from "./DynamoDaoFactory";
export class AuthTokenDaoDynamo implements AuthTokenDaoInterface {
   private tableName = "authToken";
   private readonly tokenAttr = "token";
   private readonly aliasAttr = "alias";
   private readonly createdAtAttr = "createdAt";
   private readonly expirationAttr = "expiration";

   public async putAuthToken(token: AuthToken, alias: string): Promise<void> {
      const params = {
         TableName: this.tableName,
         Item: this.generateAuthTokenItem(token, alias)
      };
      await client.send(new PutCommand(params));
   }

   public async getAssociatedAlias(token: AuthToken): Promise<string | undefined> {
      const params = {
         TableName: this.tableName,
         Key: this.generateAuthTokenKey(token.token)
      };
      const output = await client.send(new GetCommand(params));
      if (output.Item == undefined) {
         return undefined;
      }
      return this.checkExpired(output.Item[this.expirationAttr])
         ? undefined
         : output.Item[this.aliasAttr];
   }

   public async updateTokenExpiration(token: AuthToken): Promise<void> {
      const params = {
         TableName: this.tableName,
         Key: this.generateAuthTokenKey(token.token),
         UpdateExpression: "SET #expiration = :expiration",
         ExpressionAttributeNames: {
            "#expiration": this.expirationAttr
         },
         ExpressionAttributeValues: {
            ":expiration": this.calculateExpiration()
         }
      };
      await client.send(new UpdateCommand(params));
   }

   public async deleteAuthToken(token: AuthToken): Promise<void> {
      const params = {
         TableName: this.tableName,
         Key: this.generateAuthTokenKey(token.token)
      };
      await client.send(new DeleteCommand(params));
   }

   private generateAuthTokenItem(token: AuthToken, alias: string) {
      return {
         token: token.token,
         alias: alias,
         createdAt: Math.floor(token.timestamp / 1000),
         expiration: this.calculateExpiration()
      }
   }

   private generateAuthTokenKey(token: string) {
      return {
         token: token
      }
   }

   private calculateExpiration() {
      // Calculate the expiration time (one hour from now) in epoch millisecond format
      return Math.floor(createTimeStamp() + (60 * 60 * 1000));
   }

   private checkExpired(timestamp: number): boolean {
      return timestamp < createTimeStamp();
   }
}
