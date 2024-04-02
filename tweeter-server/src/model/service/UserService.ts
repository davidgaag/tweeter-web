import { AuthToken, FakeData, User } from "tweeter-shared";
import bcrypt from 'bcrypt';
import { AuthTokenDaoInterface, DaoFactory, ImageDaoInterface, UserDaoInterface } from "../../dao/DaoInterfaces";

export class UserService {
   private userDao: UserDaoInterface;
   private imageDao: ImageDaoInterface;
   private authTokenDao: AuthTokenDaoInterface;

   constructor(daoFactory: DaoFactory) {
      this.userDao = daoFactory.getUserDao();
      this.imageDao = daoFactory.getImageDao();
      this.authTokenDao = daoFactory.getAuthTokenDao();
   }

   public async getUser(
      authToken: AuthToken,
      alias: string
   ): Promise<User | null> {
      // TODO: M4 real data
      return FakeData.instance.findUserByAlias(alias);
   };

   public async login(
      alias: string,
      password: string
   ): Promise<[User, AuthToken]> {

      // return await bcrypt.compare(password, hash);

      // TODO: M4 real data
      let user = FakeData.instance.firstUser;

      if (user === null) {
         throw new Error("Invalid alias or password");
      }

      return [user, FakeData.instance.authToken];
   };

   public async register(
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageStringBase64: string
   ): Promise<[User, AuthToken]> {
      const aliasWithoutAtSign = this.stripAtSign(alias);

      // Check if alias is already taken
      const existingUser = this.userDao.getUserByAlias(aliasWithoutAtSign);
      if (existingUser !== undefined) {
         throw new Error("[Conflict] Alias is already taken");
      }

      // Save image
      let imageUrl = "";
      if (userImageStringBase64 !== "") {
         try {
            imageUrl = await this.imageDao.putImage(aliasWithoutAtSign, userImageStringBase64);
         } catch (error) {
            throw new Error("[Internal Server Error] Could not save image");
         }
      }

      // Create user if alias is not taken
      const hashedPassword = await this.hashPassword(password);
      try {
         await this.userDao.putUser(firstName, lastName, aliasWithoutAtSign, imageUrl, hashedPassword);
      } catch (error) {
         throw new Error("[Internal Server Error] Could not create user");
      }

      // Create auth token
      const authToken = AuthToken.Generate();
      try {
         await this.authTokenDao.putAuthToken(authToken.token, aliasWithoutAtSign);
      } catch (error) {
         throw new Error("[Internal Server Error] Could not create auth token");
      }

      const user = new User(firstName, lastName, this.addAtSign(aliasWithoutAtSign), imageUrl);
      return [user, authToken];
   };

   public async logout(authToken: AuthToken): Promise<void> {
      // TODO: M4
      console.log("I would have logged out if I were connected to the server.");
   };

   private stripAtSign(alias: string) {
      if (alias[0] === '@') {
         return alias.substring(1);
      }
      return alias;
   }

   private addAtSign(alias: string) {
      if (alias[0] !== '@') {
         return '@' + alias;
      }
      return alias;
   }

   private async hashPassword(password: string): Promise<string> {
      const saltRounds = 10;
      return await bcrypt
         .genSalt(saltRounds)
         .then(salt => {
            return bcrypt.hash(password, salt);
         });
   }
}