"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    userDao;
    imageDao;
    authTokenDao;
    constructor(daoFactory) {
        this.userDao = daoFactory.getUserDao();
        this.imageDao = daoFactory.getImageDao();
        this.authTokenDao = daoFactory.getAuthTokenDao();
    }
    async getUser(authToken, alias) {
        // TODO: M4 real data
        return tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
    }
    async login(alias, password) {
        const aliasWithoutAtSign = this.stripAtSign(alias);
        const result = await this.userDao.getUserByAlias(aliasWithoutAtSign);
        if (result === undefined) {
            throw new Error("[Unauthorized] Invalid alias or password");
        }
        ;
        const [user, hashedPassword] = result;
        if (await this.comparePasswords(password, hashedPassword)) {
            const authToken = tweeter_shared_1.AuthToken.Generate();
            try {
                await this.authTokenDao.putAuthToken(authToken, aliasWithoutAtSign);
            }
            catch (error) {
                throw new Error("[Internal Server Error] Could not create auth token");
            }
            user.alias = this.addAtSign(user.alias);
            return [user, authToken];
        }
        else {
            throw new Error("[Unauthorized] Invalid alias or password");
        }
    }
    async register(firstName, lastName, alias, password, userImageStringBase64) {
        console.log(firstName, lastName, alias, password, "image not shown");
        const aliasWithoutAtSign = this.stripAtSign(alias);
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
            }
            catch (error) {
                throw new Error("[Internal Server Error] Could not save image");
            }
        }
        // Create user if alias is not taken
        const hashedPassword = await this.hashPassword(password);
        try {
            await this.userDao.putUser(firstName, lastName, aliasWithoutAtSign, imageUrl, hashedPassword);
        }
        catch (error) {
            throw new Error("[Internal Server Error] Could not create user");
        }
        // Create auth token
        const authToken = tweeter_shared_1.AuthToken.Generate();
        try {
            await this.authTokenDao.putAuthToken(authToken.token, aliasWithoutAtSign);
        }
        catch (error) {
            throw new Error("[Internal Server Error] Could not create auth token" + error);
        }
        const user = new tweeter_shared_1.User(firstName, lastName, this.addAtSign(aliasWithoutAtSign), imageUrl);
        return [user, authToken];
    }
    async logout(authToken) {
        // TODO: M4
        console.log("I would have logged out if I were connected to the server.");
    }
    stripAtSign(alias) {
        if (alias[0] === '@') {
            return alias.substring(1);
        }
        return alias;
    }
    addAtSign(alias) {
        if (alias[0] !== '@') {
            return '@' + alias;
        }
        return alias;
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
