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
exports.ContentResolver = exports.ResolvedContentStatus = void 0;
const apiClient_1 = require("./apiClient");
const config_1 = require("./config");
const models_1 = require("./models");
var ResolvedContentStatus;
(function (ResolvedContentStatus) {
    ResolvedContentStatus["Unknown"] = "UNKNOWN";
    ResolvedContentStatus["Resolved"] = "RESOLVED";
    ResolvedContentStatus["NotFound"] = "NOTFOUND";
    ResolvedContentStatus["Unauthorized"] = "UNAUTHORIZED";
    ResolvedContentStatus["AccessDenied"] = "ACCESSDENIED";
})(ResolvedContentStatus = exports.ResolvedContentStatus || (exports.ResolvedContentStatus = {}));
class ContentResolver {
    constructor(config) {
        _api.set(this, void 0);
        __classPrivateFieldSet(this, _api, new apiClient_1.ApiClient(Object.assign(Object.assign({}, config_1.defaultConfig), config)));
        __classPrivateFieldGet(this, _api).onConfig = (config) => {
            config.validateStatus = (status) => {
                // When resolving content we want to return ResolvedContent
                // regardless the content was found or not.
                return status >= 200 && status < 500;
            };
            return config;
        };
    }
    resolveContent(url, matchExact, select, expand = ['*']) {
        const parameters = {
            'contentUrl': url,
            'matchExact': matchExact,
            'select': select === null || select === void 0 ? void 0 : select.join(),
            'expand': expand === null || expand === void 0 ? void 0 : expand.join(),
        };
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _api).get('/content', parameters).then((response) => {
                var _a;
                const contentData = response.data;
                let status = ResolvedContentStatus.Unknown;
                let content;
                switch (response.status) {
                    case 401:
                        status = ResolvedContentStatus.Unauthorized;
                        break;
                    case 403:
                        status = ResolvedContentStatus.AccessDenied;
                        break;
                    case 404:
                        status = ResolvedContentStatus.NotFound;
                        break;
                    default:
                        if ((contentData === null || contentData === void 0 ? void 0 : contentData.length) > 0) {
                            status = ResolvedContentStatus.Resolved;
                            content = contentData[0];
                        }
                        else {
                            status = ResolvedContentStatus.NotFound;
                        }
                        break;
                }
                ;
                const result = {
                    content: content,
                    branch: response.headers['x-epi-branch'],
                    status: status,
                    mode: (_a = models_1.ContextMode[response.headers['x-epi-contextmode']]) !== null && _a !== void 0 ? _a : models_1.ContextMode.Default,
                    remainingPath: response.headers['x-epi-remainingroute'],
                    site: response.headers['x-epi-siteid'],
                    startPage: response.headers['x-epi-startpageguid'],
                };
                resolve(result);
            }).catch((error) => {
                reject(MapAxiosErrorToContentResolverError(error));
            });
        });
    }
}
exports.ContentResolver = ContentResolver;
_api = new WeakMap();
function MapAxiosErrorToContentResolverError(error) {
    return {
        statusText: error.message,
    };
}
//# sourceMappingURL=contentResolver.js.map