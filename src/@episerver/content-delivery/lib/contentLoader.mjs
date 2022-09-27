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
var _ContentLoader_api;
import { ApiClient } from './apiClient.mjs';
import { defaultConfig } from './config.mjs';
/**
 * Class for loading content.
 */
export class ContentLoader {
    /**
     * Constructs an instance of ContentLoader.
     *
     * @param config - Optional configuration to use. The configuration is
     * combined with the default configuration specified in defaultConfig.
     */
    constructor(config) {
        _ContentLoader_api.set(this, void 0);
        __classPrivateFieldSet(this, _ContentLoader_api, new ApiClient(Object.assign(Object.assign({}, defaultConfig), config)), "f");
    }
    /**
     * Get content by an identifier.
     *
     * @param id - Identifier of the content.
     * @param request - Additional request parameters.
     * @returns A promise with a ContentData if the content was found, otherwise rejected with a ContentLoaderError.
     */
    getContent(id, request) {
        const parameters = __classPrivateFieldGet(this, _ContentLoader_api, "f").getDefaultParameters(request === null || request === void 0 ? void 0 : request.select, request === null || request === void 0 ? void 0 : request.expand);
        const headers = __classPrivateFieldGet(this, _ContentLoader_api, "f").getDefaultHeaders(request === null || request === void 0 ? void 0 : request.branch);
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _ContentLoader_api, "f").get(`content/${encodeURIComponent(id)}`, parameters, headers).then((response) => {
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
     * Get children by a parent identifier.
     *
     * @param id - Identifier of the parent content.
     * @param request - Additional request parameters.
     * @returns A promise with an array of ContentData or a ContentCollection if 'top'
     * or a 'continuationToken' is provided. Otherwise rejected with a ContentLoaderError.
     */
    getChildren(id, request) {
        let parameters = __classPrivateFieldGet(this, _ContentLoader_api, "f").getDefaultParameters(request === null || request === void 0 ? void 0 : request.select, request === null || request === void 0 ? void 0 : request.expand);
        let headers = __classPrivateFieldGet(this, _ContentLoader_api, "f").getDefaultHeaders(request === null || request === void 0 ? void 0 : request.branch);
        if ((request === null || request === void 0 ? void 0 : request.top) || (request === null || request === void 0 ? void 0 : request.continuationToken)) {
            if (request === null || request === void 0 ? void 0 : request.top)
                parameters = Object.assign(Object.assign({}, parameters), { top: request === null || request === void 0 ? void 0 : request.top });
            if (request === null || request === void 0 ? void 0 : request.continuationToken)
                headers = Object.assign(Object.assign({}, headers), { 'x-epi-continuation': request.continuationToken });
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _ContentLoader_api, "f").get(`content/${encodeURIComponent(id)}/children`, parameters, headers).then((response) => {
                    if (response.ok) {
                        resolve({
                            items: response.data,
                            continuationToken: response.headers.get('x-epi-continuation')
                        });
                    }
                    else {
                        reject(mapResponseToError(response));
                    }
                }).catch((error) => {
                    reject(mapToError(error));
                });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _ContentLoader_api, "f").get(`content/${encodeURIComponent(id)}/children`, parameters, headers).then((response) => {
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
    /**
     * Get ancestors by a parent identifier.
     *
     * @param parentId - Identifier of the content.
     * @param request - Additional request parameters.
     * @returns A promise with an array of ContentData, otherwise rejected with a ContentLoaderError.
     */
    getAncestors(id, request) {
        const parameters = __classPrivateFieldGet(this, _ContentLoader_api, "f").getDefaultParameters(request === null || request === void 0 ? void 0 : request.select, request === null || request === void 0 ? void 0 : request.expand);
        const headers = __classPrivateFieldGet(this, _ContentLoader_api, "f").getDefaultHeaders(request === null || request === void 0 ? void 0 : request.branch);
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _ContentLoader_api, "f").get(`content/${encodeURIComponent(id)}/ancestors`, parameters, headers).then((response) => {
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
_ContentLoader_api = new WeakMap();
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
//# sourceMappingURL=contentLoader.mjs.map