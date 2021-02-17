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
/**
 * Class for loading content.
 */
class ContentLoader {
    /**
     * Constructs an instance of ContentLoader.
     *
     * @param config - Optional configuration to use. The configuration is
     * combined with the default configuration specified in defaultConfig.
     */
    constructor(config) {
        _api.set(this, void 0);
        __classPrivateFieldSet(this, _api, new apiClient_1.ApiClient(Object.assign(Object.assign({}, config_1.defaultConfig), config)));
    }
    /**
     * Get content by an identifier.
     *
     * @param id - Identifier of the content.
     * @param branch - Branch of the content.
     * @param select - Properties to include in the response. All by default.
     * @param expand - Properties to expand in the response. All by default.
     * @returns A promise with a ContentData if the content was found, otherwise rejected with a ContentLoaderError.
     */
    getContent(id, branch = '*', select, expand) {
        const headers = {
            'Accept-Language': branch,
        };
        const parameters = {
            'select': select ? select.join() : null,
            'expand': expand ? expand.join() : '*',
        };
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _api).get(`/content/${id}`, parameters, headers).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(MapAxiosErrorToContentLoaderError(error));
            });
        });
    }
    /**
     * Get child content by an identifier.
     *
     * @param id - Identifier of the parent content.
     * @param branch - Branch of the content.
     * @param select - Properties to include in the response. All by default.
     * @param expand - Properties to expand in the response. All by default.
     * @returns A promise with an array of ContentData, otherwise rejected with a ContentLoaderError.
     */
    getChildren(id, branch = '*', select, expand) {
        const headers = {
            'Accept-Language': branch,
        };
        const parameters = {
            'select': select ? select.join() : null,
            'expand': expand ? expand.join() : '*',
        };
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _api).get(`/content/${id}/children`, parameters, headers).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(MapAxiosErrorToContentLoaderError(error));
            });
        });
    }
    /**
     * Get ancestor content by an identifier.
     *
     * @param parentId - Identifier of the content.
     * @param branch - Branch of the content.
     * @param select - Properties to include in the response. All by default.
     * @param expand - Properties to expand in the response. All by default.
     * @returns A promise with an array of ContentData, otherwise rejected with a ContentLoaderError.
     */
    getAncestors(id, branch = '*', select, expand) {
        const headers = {
            'Accept-Language': branch,
        };
        const parameters = {
            'select': select ? select.join() : null,
            'expand': expand ? expand.join() : '*',
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
            statusCode: error.response.status,
            errorMessage: error.response.statusText,
        };
    }
    return {
        statusCode: 0,
        errorMessage: error.message,
    };
}
//# sourceMappingURL=contentLoader.js.map