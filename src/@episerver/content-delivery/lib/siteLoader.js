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
exports.SiteLoader = void 0;
const apiClient_1 = require("./apiClient");
const config_1 = require("./config");
/**
 * Class for loading sites.
 */
class SiteLoader {
    /**
     * Constructs an instance of SiteLoader.
     *
     * @param config - Optional configuration to use. The configuration is
     * combined with the default configuration specified in defaultConfig.
     */
    constructor(config) {
        _api.set(this, void 0);
        __classPrivateFieldSet(this, _api, new apiClient_1.ApiClient(Object.assign(Object.assign({}, config_1.defaultConfig), config)));
    }
    /**
     * Get site by an identifier.
     *
     * @param id - Identifier of the site.
     * @returns A promise with a SiteDefinition if the site was found, otherwise rejected with a SiteLoaderError.
     */
    getSite(id) {
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _api).get(`/site/${id}`).then((response) => {
                if (response.ok) {
                    resolve(response.data);
                }
                else {
                    reject(mapResponseToError(response));
                }
            }).catch((error) => {
                reject(mapToError(error));
            });
        });
    }
    /**
   * List all sites.
   *
   * @returns A promise with an array of SiteDefinition. Otherwise rejected with a SiteLoaderError.
   */
    getSites() {
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _api).get(`/site/`).then((response) => {
                if (response.ok) {
                    resolve(response.data);
                }
                else {
                    reject(mapResponseToError(response));
                }
            }).catch((error) => {
                reject(mapToError(error));
            });
        });
    }
}
exports.SiteLoader = SiteLoader;
_api = new WeakMap();
function mapResponseToError(response) {
    return {
        errorCode: response.status,
        errorMessage: response.statusText,
    };
}
function mapToError(error) {
    return {
        errorMessage: error.statusText,
    };
}
//# sourceMappingURL=siteLoader.js.map