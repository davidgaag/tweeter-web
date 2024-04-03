"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
// TODO: Consts/enum for error messages?
class Service {
    authTokenDao;
    constructor(daoFactory) {
        this.authTokenDao = daoFactory.getAuthTokenDao();
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
    async tryDbOperation(operation) {
        try {
            return await operation;
        }
        catch (error) {
            throw new Error("[Internal Server Error] Could not complete operation. " + error);
        }
    }
    /**
     * Get the associated alias for the given auth token
     * @param authToken
     * @returns
     * @throws Will throw an error if the auth token is not found or is incorrect
     */
    async getAssociatedAlias(authToken) {
        const alias = await this.tryDbOperation(this.authTokenDao.getAssociatedAlias(authToken));
        if (!alias) {
            throw new Error("[Unauthorized] Invalid or incorrect auth token");
        }
        else {
            return alias;
        }
    }
}
exports.Service = Service;
