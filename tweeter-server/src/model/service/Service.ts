import { AuthToken } from "tweeter-shared";
import { AuthTokenDaoInterface, DaoFactory, UserDaoInterface } from "../../dao/DaoInterfaces";

// TODO: Consts/enum for error messages?

export class Service {
   protected authTokenDao: AuthTokenDaoInterface;
   protected userDao: UserDaoInterface;

   constructor(daoFactory: DaoFactory) {
      this.authTokenDao = daoFactory.getAuthTokenDao();
      this.userDao = daoFactory.getUserDao();
   }

   protected stripAtSign(alias: string) {
      if (alias[0] === '@') {
         return alias.substring(1);
      }
      return alias;
   }

   protected addAtSign(alias: string) {
      if (alias[0] !== '@') {
         return '@' + alias;
      }
      return alias;
   }

   protected async tryDbOperation<T>(operation: Promise<T>): Promise<T> {
      try {
         return await operation;
      } catch (error) {
         throw new Error("[Internal Server Error] Could not complete operation. " + error);
      }
   }

   /**
    * Get the associated alias for the given auth token
    * @param authToken 
    * @returns 
    * @throws Will throw an error if the auth token is not found or is incorrect
    */
   protected async getAssociatedAlias(authToken: AuthToken): Promise<string> {
      const alias = await this.tryDbOperation(this.authTokenDao.getAssociatedAlias(authToken));
      if (!alias) {
         this.authTokenDao.deleteAuthToken(authToken);
         throw new Error("[Unauthorized] Invalid, incorrect, or expired auth token");
      } else {
         return alias;
      }
   }
}