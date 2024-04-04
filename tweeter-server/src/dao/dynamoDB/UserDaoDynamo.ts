import { User } from "tweeter-shared";
import { UserDaoInterface } from "../DaoInterfaces";
import { DynamoDBClient, ReturnValue } from '@aws-sdk/client-dynamodb';
import { BatchGetCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { client } from "./DynamoDaoFactory";
export class UserDaoDynamo implements UserDaoInterface {
   private tableName = "user";
   private readonly firstNameAttr = "firstName";
   private readonly lastNameAttr = "lastName";
   private readonly aliasAttr = "alias";
   private readonly passwordAttr = "password";
   private readonly imageUrlAtrr = "imageUrl";
   private readonly numFollowersAttr = "numFollowers";
   private readonly numFolloweesAttr = "numFollowees";

   private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

   public async getUserByAlias(alias: string): Promise<[User, string] | undefined> {
      const params = {
         TableName: this.tableName,
         Key: this.generateUserKey(alias)
      };
      const output = await client.send(new GetCommand(params));
      return output.Item == undefined
         ? undefined
         : [new User(
            output.Item[this.firstNameAttr],
            output.Item[this.lastNameAttr],
            output.Item[this.aliasAttr],
            output.Item[this.imageUrlAtrr]
         ),
         output.Item[this.passwordAttr]];
   }

   public async getUsersByAlias(aliases: string[]): Promise<User[]> {
      const params = {
         RequestItems: {
            [this.tableName]: {
               Keys: aliases.map(alias => this.generateUserKey(alias))
            }
         }
      };

      const output = await client.send(new BatchGetCommand(params));
      return output.Responses == undefined
         ? []
         : output.Responses[this.tableName].map((item: any) => new User(
            item[this.firstNameAttr],
            item[this.lastNameAttr],
            item[this.aliasAttr],
            item[this.imageUrlAtrr]
         ));
   }

   public async putUser(firstName: string, lastName: string, alias: string, imageUrl: string, hashedPassword: string): Promise<void> {
      const params = {
         TableName: this.tableName,
         Item: this.generateUserItem(firstName, lastName, alias, imageUrl, hashedPassword)
      }
      await client.send(new PutCommand(params));
   }

   public async getNumFollowers(alias: string): Promise<number | undefined> {
      return await this.getFollowCount(alias, this.numFollowersAttr);
   }

   public async getNumFollowees(alias: string): Promise<number | undefined> {
      return await this.getFollowCount(alias, this.numFolloweesAttr);
   }

   public async incrementFollowers(alias: string): Promise<number | undefined> {
      return await this.incrementFollowCount(alias, this.numFollowersAttr);
   }

   public async decrementFollowers(alias: string): Promise<number | undefined> {
      return await this.decrementFollowCount(alias, this.numFollowersAttr);
   }

   public async incrementFollowees(alias: string): Promise<number | undefined> {
      return await this.incrementFollowCount(alias, this.numFolloweesAttr);
   }

   public async decrementFollowees(alias: string): Promise<number | undefined> {
      return await this.decrementFollowCount(alias, this.numFolloweesAttr);
   }

   private async getFollowCount(alias: string, attribute: string): Promise<number | undefined> {
      const params = {
         TableName: this.tableName,
         Key: this.generateUserKey(alias),
         ProjectionExpression: attribute
      };
      const output = await client.send(new GetCommand(params));
      return output.Item == undefined ? undefined : output.Item[attribute];
   }

   private async incrementFollowCount(alias: string, attribute: string): Promise<number | undefined> {
      const params = {
         TableName: this.tableName,
         Key: this.generateUserKey(alias),
         ExpressionAttributeNames: {
            [`#${attribute}`]: attribute // numFollowers or numFollowees
         },
         ExpressionAttributeValues: {
            ":increment": 1
         },
         UpdateExpression: `ADD #${attribute} :increment`,
         ReturnValues: ReturnValue.UPDATED_NEW
      };
      const output = await client.send(new UpdateCommand(params));
      return output.Attributes == undefined ? undefined : output.Attributes[attribute];
   }

   private async decrementFollowCount(alias: string, attribute: string): Promise<number | undefined> {
      const params = {
         TableName: this.tableName,
         Key: this.generateUserKey(alias),
         ExpressionAttributeNames: {
            [`#${attribute}`]: attribute // numFollowers or numFollowees
         },
         ExpressionAttributeValues: {
            ":decrement": -1
         },
         UpdateExpression: `ADD #${attribute} :decrement`,
         ReturnValues: ReturnValue.UPDATED_NEW
      };
      const output = await client.send(new UpdateCommand(params));
      return output.Attributes == undefined ? undefined : output.Attributes[attribute];
   }

   private generateUserItem(firstName: string, lastName: string, alias: string, imageUrl: string, hashedPassword: string) {
      return {
         firstName: firstName,
         lastName: lastName,
         alias: alias,
         imageUrl: imageUrl,
         password: hashedPassword,
         numFollowers: 0,
         numFollowees: 0
      }
   }

   private generateUserKey(alias: string) {
      return {
         alias: alias
      }
   }
}