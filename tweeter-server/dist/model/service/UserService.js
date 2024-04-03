"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Service_1 = require("./Service");
class UserService extends Service_1.Service {
    userDao;
    imageDao;
    constructor(daoFactory) {
        super(daoFactory);
        this.userDao = daoFactory.getUserDao();
        this.imageDao = daoFactory.getImageDao();
    }
    async getUser(authToken, alias) {
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
    async login(alias, password) {
        const aliasWithoutAtSign = this.stripAtSign(alias);
        const result = await this.tryDbOperation(this.userDao.getUserByAlias(aliasWithoutAtSign));
        if (!result) {
            throw new Error("[Unauthorized] Invalid alias or password");
        }
        ;
        const [user, hashedPassword] = result;
        if (!await this.comparePasswords(password, hashedPassword)) {
            throw new Error("[Unauthorized] Invalid alias or password");
        }
        const authToken = tweeter_shared_1.AuthToken.Generate();
        await this.tryDbOperation(this.authTokenDao.putAuthToken(authToken, aliasWithoutAtSign));
        user.alias = this.addAtSign(user.alias);
        return [user, authToken];
    }
    async register(firstName, lastName, alias, password, userImageStringBase64) {
        console.log(firstName, lastName, alias, password, "image not shown");
        const aliasWithoutAtSign = this.stripAtSign(alias).toLowerCase();
        // Check if alias is already taken
        const existingUser = await this.tryDbOperation(this.userDao.getUserByAlias(aliasWithoutAtSign));
        console.log(existingUser);
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
        const authToken = tweeter_shared_1.AuthToken.Generate();
        await this.tryDbOperation(this.authTokenDao.putAuthToken(authToken, aliasWithoutAtSign));
        const user = new tweeter_shared_1.User(firstName, lastName, this.addAtSign(aliasWithoutAtSign), imageUrl);
        return [user, authToken];
    }
    async logout(authToken) {
        await this.tryDbOperation(this.authTokenDao.deleteAuthToken(authToken));
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcryptjs_1.default
            .genSalt(saltRounds)
            .then(salt => {
            return bcryptjs_1.default.hash(password, salt);
        });
    }
    async comparePasswords(password, hashedPassword) {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
}
exports.UserService = UserService;
