var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _ApiClient_config;
/**
 * Class for making API calls to the Content Delivery API.
 */
export class ApiClient {
    /**
     * Constructs an instance of ApiClient.
     *
     * @param config Configuration to use.
     */
    constructor(config) {
        _ApiClient_config.set(this, void 0);
        __classPrivateFieldSet(this, _ApiClient_config, config, "f");
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
            let requestUrl = getUrl(__classPrivateFieldGet(this, _ApiClient_config, "f").apiUrl, path, parameters);
            if (__classPrivateFieldGet(this, _ApiClient_config, "f").getUrl) {
                requestUrl = yield __classPrivateFieldGet(this, _ApiClient_config, "f").getUrl(requestUrl);
            }
            const request = {
                method: 'get',
                credentials: 'include',
                headers: yield getHeaders(path, headers, __classPrivateFieldGet(this, _ApiClient_config, "f")),
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
            select: select ? select.join() : __classPrivateFieldGet(this, _ApiClient_config, "f").selectAllProperties ? undefined : 'name',
            expand: expand ? expand.join() : __classPrivateFieldGet(this, _ApiClient_config, "f").expandAllProperties ? '*' : undefined,
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
_ApiClient_config = new WeakMap();
function getHeaders(path, headers = {}, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = new Headers();
        for (const name in headers) {
            if (headers[name] !== undefined) {
                result.set(name, headers[name]);
            }
        }
        if (config.getHeaders) {
            const configHeaders = yield config.getHeaders(path);
            if (configHeaders) {
                for (const name in configHeaders) {
                    if (configHeaders[name] !== undefined) {
                        result.set(name, configHeaders[name]);
                    }
                }
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
function getUrl(baseUrl, path, parameters = {}) {
    const tempHostname = 'http://temp';
    // The temporary host will only be used when baseUrl is relative.
    let url = new URL(baseUrl, tempHostname);
    if (url.pathname.endsWith('/')) {
        url.pathname = url.pathname + path;
    }
    else {
        url.pathname = url.pathname + '/' + path;
    }
    for (const key in parameters) {
        if (parameters[key] !== undefined) {
            url.searchParams.set(key, parameters[key]);
        }
    }
    // Return relative URL if input was relative.
    return url.hostname === tempHostname
        ? url.pathname + url.search
        : url.toString();
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
//# sourceMappingURL=apiClient.mjs.map