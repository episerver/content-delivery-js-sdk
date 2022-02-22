"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SiteLoader_api;
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
        _SiteLoader_api.set(this, void 0);
        __classPrivateFieldSet(this, _SiteLoader_api, new apiClient_1.ApiClient(Object.assign(Object.assign({}, config_1.defaultConfig), config)), "f");
    }
    /**
     * Get site by an identifier.
     *
     * @param id - Identifier of the site.
     * @returns A promise with a SiteDefinition if the site was found, otherwise rejected with a SiteLoaderError.
     */
    getSite(id) {
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _SiteLoader_api, "f").get(`/site/${encodeURIComponent(id)}`).then((response) => {
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
            __classPrivateFieldGet(this, _SiteLoader_api, "f").get(`/site/`).then((response) => {
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
_SiteLoader_api = new WeakMap();
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