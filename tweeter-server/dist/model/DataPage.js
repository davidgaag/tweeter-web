"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPage = void 0;
class DataPage {
    values;
    hasMorePages;
    constructor(values, hasMorePages) {
        this.values = values;
        this.hasMorePages = hasMorePages;
    }
}
exports.DataPage = DataPage;
