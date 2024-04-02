import { User } from "tweeter-shared";
import { UserDaoInterface } from "../DaoInterfaces";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

export class UserDaoDynamo implements UserDaoInterface {
   private tableName = "user";
   private readonly firstNameAttr = "firstName";
   private readonly lastNameAttr = "lastName";
   private readonly aliasAttr = "alias";
   private readonly passwordAttr = "password";
   private readonly imageUrlAtrr = "imageUrl";

   private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

   public async getUserByAlias(alias: string): Promise<[User, string] | undefined> {
      const params = {
         TableName: this.tableName,
         Key: this.generateUserKey(alias)
      };
      const output = await this.client.send(new GetCommand(params));
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

   public async putUser(firstName: string, lastName: string, alias: string, imageUrl: string, hashedPassword: string): Promise<void> {
      const params = {
         TableName: this.tableName,
         Item: this.generateUserItem(firstName, lastName, alias, imageUrl, hashedPassword)
      }
      await this.client.send(new PutCommand(params));
   }

   private generateUserItem(firstName: string, lastName: string, alias: string, imageUrl: string, hashedPassword: string) {
      return {
         firstName: firstName,
         lastName: lastName,
         alias: alias,
         imageUrl: imageUrl,
         password: hashedPassword
      }
   }

   private generateUserKey(alias: string) {
      return {
         alias: alias
      }
   }
}