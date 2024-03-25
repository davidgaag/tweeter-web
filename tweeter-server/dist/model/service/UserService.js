"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async login(alias, password) {
        // TODO: M4 real data
        let user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        return [user, tweeter_shared_1.FakeData.instance.authToken];
    }
    ;
    async register(firstName, lastName, alias, password, userImageStringBase64) {
        // TODO: M4 real data
        let user = tweeter_shared_1.FakeData.instance.firstUser;
        // TODO: API Gateway error handling
        if (user === null) {
            throw new Error("Invalid registration");
        }
        return [user, tweeter_shared_1.FakeData.instance.authToken];
    }
    ;
}
exports.UserService = UserService;
