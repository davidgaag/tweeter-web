import { AuthToken, User } from "tweeter-shared";
import bcrypt from 'bcryptjs';
import { DaoFactory, ImageDaoInterface, UserDaoInterface } from "../../dao/DaoInterfaces";
import { Service } from "./Service";

export class UserService extends Service {
   private userDao: UserDaoInterface;
   private imageDao: ImageDaoInterface;

   constructor(daoFactory: DaoFactory) {
      super(daoFactory);
      this.userDao = daoFactory.getUserDao();
      this.imageDao = daoFactory.getImageDao();
   }

   public async getUser(
      authToken: AuthToken,
      alias: string
   ): Promise<User> {
      const aliasWithoutAtSign = this.stripAtSign(alias).toLowerCase();

      await this.getAssociatedAlias(authToken);

      const result = await this.tryDbOperation(this.userDao.getUserByAlias(aliasWithoutAtSign));
      if (!result) {
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

      const result = await this.tryDbOperation(this.userDao.getUserByAlias(aliasWithoutAtSign));
      if (!result) {
         throw new Error("[Unauthorized] Invalid alias or password");
      };

      const [user, hashedPassword] = result;
      if (!await this.comparePasswords(password, hashedPassword)) {
         throw new Error("[Unauthorized] Invalid alias or password");
      }

      const authToken = AuthToken.Generate();

      await this.tryDbOperation(this.authTokenDao.putAuthToken(authToken, aliasWithoutAtSign));

      user.alias = this.addAtSign(user.alias);
      return [user, authToken];
   }

   public async register(
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageStringBase64: string
   ): Promise<[User, AuthToken]> {
      const aliasWithoutAtSign = this.stripAtSign(alias).toLowerCase();

      // Check if alias is already taken
      const existingUser = await this.tryDbOperation(this.userDao.getUserByAlias(aliasWithoutAtSign));
      if (existingUser) {
         throw new Error("[Conflict] Alias is already taken");
      }

      // Save image
      let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
      if (userImageStringBase64 !== "") {
         imageUrl = await this.tryDbOperation(this.imageDao.putImage(userImageStringBase64, aliasWithoutAtSign));
      }

      // Create user in database if alias is not taken
      const hashedPassword = await this.hashPassword(password);
      await this.tryDbOperation(this.userDao.putUser(firstName, lastName, aliasWithoutAtSign, imageUrl, hashedPassword));

      // Create auth token in database
      const authToken = AuthToken.Generate();
      await this.tryDbOperation(this.authTokenDao.putAuthToken(authToken, aliasWithoutAtSign));

      const user = new User(firstName, lastName, this.addAtSign(aliasWithoutAtSign), imageUrl);
      return [user, authToken];
   }

   public async logout(authToken: AuthToken): Promise<void> {
      await this.tryDbOperation(this.authTokenDao.deleteAuthToken(authToken));
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