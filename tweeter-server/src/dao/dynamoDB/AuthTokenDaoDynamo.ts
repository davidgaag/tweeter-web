import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDaoInterface } from "../DaoInterfaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";

export class AuthTokenDaoDynamo implements AuthTokenDaoInterface {
   private tableName = "authToken";
   private readonly tokenAttr = "token";
   private readonly aliasAttr = "alias";
   private readonly createdAtAttr = "createdAt";
   private readonly expirationAttr = "expiration";

   private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

   public async putAuthToken(token: AuthToken, alias: string): Promise<void> {
      const params = {
         TableName: this.tableName,
         Item: this.generateAuthTokenItem(token, alias)
      };
      await this.client.send(new PutCommand(params));
   }

   // public async checkAuthToken(token: AuthToken): Promise<boolean> {
   //    const params = {
   //       TableName: this.tableName,
   //       Key: this.generateAuthTokenKey(token.token)
   //    };
   //    const output = await this.client.send(new GetCommand(params));
   //    return output.Item != undefined;
   // }

   // TODO: Is this necessary?
   public async getAssociatedAlias(token: AuthToken): Promise<string | undefined> {
      const params = {
         TableName: this.tableName,
         Key: this.generateAuthTokenKey(token.token)
      };
      const output = await this.client.send(new GetCommand(params));
      return output.Item == undefined ? undefined : output.Item[this.aliasAttr];
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
      await this.client.send(new UpdateCommand(params));
   }

   public async deleteAuthToken(token: AuthToken): Promise<void> {
      const params = {
         TableName: this.tableName,
         Key: this.generateAuthTokenKey(token.token)
      };
      await this.client.send(new DeleteCommand(params));
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
      // Calculate the expiration time (one hour from now) in epoch second format
      return Math.floor((new Date().getTime() / 1000) + 60 * 60);
   }
}
