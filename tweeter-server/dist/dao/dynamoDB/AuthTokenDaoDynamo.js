"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenDaoDynamo = void 0;
class AuthTokenDaoDynamo {
    tableName = "authToken";
    tokenAttr = "token";
    aliasAttr = "alias";
    async putAuthToken(token, alias) {
        const params = {
            TableName: this.tableName,
            Item: this.generateAuthTokenItem(token, alias)
        };
    }
    generateAuthTokenItem(token, alias) {
        return {
            token: token,
            alias: alias
        };
    }
}
exports.AuthTokenDaoDynamo = AuthTokenDaoDynamo;
