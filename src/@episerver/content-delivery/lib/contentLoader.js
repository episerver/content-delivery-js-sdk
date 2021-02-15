"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentLoader = void 0;
const apiClient_1 = require("./apiClient");
const config_1 = require("./config");
class ContentLoader {
    constructor(config) {
        this.api = new apiClient_1.ApiClient(Object.assign(Object.assign({}, config_1.defaultConfig), config));
    }
    getContent(id, branch = '*', select, expand = ['*']) {
        const headers = {
            'Accept-Language': branch,
        };
        const parameters = {
            'select': select === null || select === void 0 ? void 0 : select.join(),
            'expand': expand === null || expand === void 0 ? void 0 : expand.join(),
        };
        return new Promise((resolve, reject) => {
            this.api.get(`/content/${id}`, parameters, headers).then((response) => {
                resolve(response.data);
            }).catch((response) => {
                reject(response);
            });
        });
    }
    getChildren(id, branch = '*', select, expand = ['*']) {
        const headers = {
            'Accept-Language': branch,
        };
        const parameters = {
            'select': select === null || select === void 0 ? void 0 : select.join(),
            'expand': expand === null || expand === void 0 ? void 0 : expand.join(),
        };
        return new Promise((resolve, reject) => {
            this.api.get(`/content/${id}/children`, parameters, headers).then((response) => {
                resolve(response.data);
            }).catch((response) => {
                reject(response);
            });
        });
    }
    getAncestors(id, branch = '*', select, expand = ['*']) {
        const headers = {
            'Accept-Language': branch,
        };
        const parameters = {
            'select': select === null || select === void 0 ? void 0 : select.join(),
            'expand': expand === null || expand === void 0 ? void 0 : expand.join(),
        };
        return new Promise((resolve, reject) => {
            this.api.get(`/content/${id}/ancestors`, parameters, headers).then((response) => {
                resolve(response.data);
            }).catch((response) => {
                reject(response);
            });
        });
    }
}
exports.ContentLoader = ContentLoader;
//# sourceMappingURL=contentLoader.js.map