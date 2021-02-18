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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _config, _onBeforeRequest;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
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
        _onBeforeRequest.set(this, void 0);
        __classPrivateFieldSet(this, _config, config);
    }
    /**
     * Sets the function to call for getting an access token
     * to authorize the request.
     *
     * @param onBeforeRequest - Function to use.
     */
    set onBeforeRequest(onBeforeRequest) {
        __classPrivateFieldSet(this, _onBeforeRequest, onBeforeRequest);
    }
    /**
     * Make a GET request.
     *
     * @param path - Path to request.
     * @param parameters - Parameters to include in the request.
     * @param headers - Headers to include in the request.
     * @returns A promise with an AxiosResponse if the request was successful, otherwise rejected with an AxiosError.
     */
    get(path, parameters, headers) {
        const config = {
            method: 'get',
            baseURL: __classPrivateFieldGet(this, _config).apiUrl,
            params: parameters,
            headers: headers,
        };
        if (__classPrivateFieldGet(this, _config).getAccessToken) {
            __classPrivateFieldGet(this, _config).getAccessToken(path).then((accessToken) => {
                config.headers.Authorization = `Bearer ${accessToken}`;
                config.withCredentials = true;
            });
        }
        var instance = axios_1.default.create(config);
        if (__classPrivateFieldGet(this, _onBeforeRequest)) {
            instance.interceptors.request.use(__classPrivateFieldGet(this, _onBeforeRequest));
        }
        return instance.get(path);
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
            ['Accept-Language']: branch ? branch : '*'
        };
    }
}
exports.ApiClient = ApiClient;
_config = new WeakMap(), _onBeforeRequest = new WeakMap();
//# sourceMappingURL=apiClient.js.map