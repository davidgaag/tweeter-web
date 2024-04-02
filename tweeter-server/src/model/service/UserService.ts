import { AuthToken, User } from "tweeter-shared";
import bcrypt from 'bcryptjs';
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
      const aliasWithoutAtSign = this.stripAtSign(alias).toLowerCase();

      if (!await this.authTokenDao.checkAuthToken(authToken)) {
         throw new Error("[Unauthorized] Invalid auth token");
      }

      const result = await this.userDao.getUserByAlias(aliasWithoutAtSign);
      if (result === undefined) {
         throw new Error("[Not Found] User not found");
      }

      const [user, _] = result;
      user.alias = this.addAtSign(user.alias);
      return user;
   }

   public async login(
      alias: string,
      password: string
   ): Promise<[User, AuthToken]> {
      const aliasWithoutAtSign = this.stripAtSign(alias);

      const result = await this.userDao.getUserByAlias(aliasWithoutAtSign);
      if (result === undefined) {
         throw new Error("[Unauthorized] Invalid alias or password");
      };

      const [user, hashedPassword] = result;
      if (await this.comparePasswords(password, hashedPassword)) {
         const authToken = AuthToken.Generate();
         try {
            await this.authTokenDao.putAuthToken(authToken, aliasWithoutAtSign);
         } catch (error) {
            throw new Error("[Internal Server Error] Could not create auth token");
         }

         user.alias = this.addAtSign(user.alias);
         return [user, authToken];
      } else {
         throw new Error("[Unauthorized] Invalid alias or password");
      }
   }

   public async register(
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageStringBase64: string
   ): Promise<[User, AuthToken]> {
      console.log(firstName, lastName, alias, password, "image not shown");
      const aliasWithoutAtSign = this.stripAtSign(alias).toLowerCase();

      // Check if alias is already taken
      const existingUser = await this.userDao.getUserByAlias(aliasWithoutAtSign);
      console.log(existingUser);
      if (existingUser !== undefined) {
         throw new Error("[Conflict] Alias is already taken");
      }

      // Save image
      let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
      if (userImageStringBase64 !== "") {
         try {
            imageUrl = await this.imageDao.putImage(userImageStringBase64, aliasWithoutAtSign);
         } catch (error) {
            throw new Error("[Internal Server Error] Could not save image");
         }
      }

      // Create user in database if alias is not taken
      const hashedPassword = await this.hashPassword(password);
      try {
         await this.userDao.putUser(firstName, lastName, aliasWithoutAtSign, imageUrl, hashedPassword);
      } catch (error) {
         throw new Error("[Internal Server Error] Could not create user");
      }

      // Create auth token in database
      const authToken = AuthToken.Generate();
      try {
         await this.authTokenDao.putAuthToken(authToken, aliasWithoutAtSign);
      } catch (error) {
         throw new Error("[Internal Server Error] Could not create auth token " + error);
      }

      const user = new User(firstName, lastName, this.addAtSign(aliasWithoutAtSign), imageUrl);
      return [user, authToken];
   }

   public async logout(authToken: AuthToken): Promise<void> {
      try {
         await this.authTokenDao.deleteAuthToken(authToken);
      } catch (error) {
         throw new Error("[Internal Server Error] Could not delete auth token");
      }
   }

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

   private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
      return await bcrypt.compare(password, hashedPassword);
   }
}