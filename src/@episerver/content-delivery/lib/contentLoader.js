"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _api;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentLoader = void 0;
const apiClient_1 = require("./apiClient");
const config_1 = require("./config");
class ContentLoader {
    constructor(config) {
        _api.set(this, void 0);
        __classPrivateFieldSet(this, _api, new apiClient_1.ApiClient(Object.assign(Object.assign({}, config_1.defaultConfig), config)));
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
            __classPrivateFieldGet(this, _api).get(`/content/${id}`, parameters, headers).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(MapAxiosErrorToContentLoaderError(error));
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
            __classPrivateFieldGet(this, _api).get(`/content/${id}/children`, parameters, headers).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(MapAxiosErrorToContentLoaderError(error));
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
            __classPrivateFieldGet(this, _api).get(`/content/${id}/ancestors`, parameters, headers).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(MapAxiosErrorToContentLoaderError(error));
            });
        });
    }
}
exports.ContentLoader = ContentLoader;
_api = new WeakMap();
function MapAxiosErrorToContentLoaderError(error) {
    if (error.response) {
        return {
            data: error.response.data,
            status: error.response.status,
            statusText: error.response.statusText,
        };
    }
    return {
        status: 0,
        statusText: error.message,
    };
}
//# sourceMappingURL=contentLoader.js.map