"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _config;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
require("cross-fetch/polyfill");
/**
 * Class for making API calls to the Content Delivery API.
 */
class ApiClient {
    /**
     * Constructs an instance of ApiClient.
     *
     * @param config Configuration to use.
     */
    constructor(config) {
        _config.set(this, void 0);
        __classPrivateFieldSet(this, _config, config);
    }
    /**
     * Make a GET request.
     *
     * @param path - Path to request.
     * @param parameters - Parameters to include in the request.
     * @param headers - Headers to include in the request.
     * @returns A promise with an ApiRespone if the request was successful, otherwise rejected with an ApiError.
     */
    get(path, parameters = {}, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestUrl = getUrl(__classPrivateFieldGet(this, _config).apiUrl, path, parameters);
            const request = {
                method: 'get',
                credentials: 'include',
                headers: yield getHeaders(path, headers, __classPrivateFieldGet(this, _config)),
            };
            return new Promise((resolve, reject) => {
                fetch(requestUrl, request).then((response) => __awaiter(this, void 0, void 0, function* () {
                    const result = {
                        ok: response.ok,
                        status: response.status,
                        statusText: response.statusText,
                        headers: new Map(),
                        data: yield response.json().catch(() => { }),
                    };
                    // try {
                    //   result.data = await response.json();
                    // } catch (error) {
                    // }
                    response.headers.forEach((value, key) => {
                        result.headers.set(key, value);
                    });
                    resolve(result);
                })).catch((error) => {
                    reject(mapToError(error));
                });
            });
        });
    }
    /**
     * Get default API parameters to use when making requests.
     *
     * @param select - Properties to include in the response. All by default, unless configured differently.
     * @param expand - Properties to expand in the response. None by default, unless configured differently.
     * @returns Default parameters combined with the default configuration.
     */
    getDefaultParameters(select, expand) {
        return {
            select: select ? select.join() : __classPrivateFieldGet(this, _config).selectAllProperties ? undefined : 'name',
            expand: expand ? expand.join() : __classPrivateFieldGet(this, _config).expandAllProperties ? '*' : undefined,
        };
    }
    /**
     * Get default API headers to use when making requests.
     *
     * @param branch - Branch of the content.
     * @returns Default headers combined with the default configuration.
     */
    getDefaultHeaders(branch) {
        return {
            'Accept-Language': branch ? branch : undefined
        };
    }
}
exports.ApiClient = ApiClient;
_config = new WeakMap();
function getHeaders(path, headers = {}, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = new Headers();
        for (const name in headers) {
            if (headers[name] !== undefined) {
                result.set(name, headers[name]);
            }
        }
        if (config.getAccessToken) {
            const accessToken = yield config.getAccessToken(path);
            if (accessToken) {
                result.set('Authorization', `Bearer ${accessToken}`);
            }
        }
        return Promise.resolve(result);
    });
}
function getUrl(baseUrl, path, parameters) {
    if (!baseUrl.endsWith('/'))
        baseUrl += '/';
    if (path.startsWith('/'))
        path = path.substring(1);
    let query = Object.keys(parameters)
        .filter(key => parameters[key] !== undefined)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
        .join('&');
    if (query)
        query = '?' + query;
    return baseUrl + path + query;
}
function mapToError(error) {
    let result = {};
    if (typeof error.json === 'function') {
        error.json().then((jsonError) => {
            result.data = jsonError;
        }).catch((errorResponse) => {
            result.status = errorResponse.status;
            result.statusText = errorResponse.statusText;
        });
    }
    else {
        result.statusText = error;
    }
    return result;
}
//# sourceMappingURL=apiClient.js.map