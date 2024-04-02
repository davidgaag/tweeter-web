import { AuthTokenDaoInterface } from "../DaoInterfaces";

export class AuthTokenDaoDynamo implements AuthTokenDaoInterface {
   private tableName = "authToken";
   private readonly tokenAttr = "token";
   private readonly aliasAttr = "alias";

   public async putAuthToken(token: string, alias: string): Promise<void> {
      const params = {
         TableName: this.tableName,
         Item: this.generateAuthTokenItem(token, alias)
      };

   }

   private generateAuthTokenItem(token: string, alias: string) {
      return {
         token: token,
         alias: alias
      }
   }
}

