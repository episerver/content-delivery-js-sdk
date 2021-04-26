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
import { ApiClient } from './apiClient';
import { defaultConfig } from './config';
import { ContextMode } from './models';
/**
 * Enum describing the status of the resolved content.
 */
export var ResolvedContentStatus;
(function (ResolvedContentStatus) {
    /**
     * Content was unsuccessfully resolved due to
     * unknown reasons.
     */
    ResolvedContentStatus["Unknown"] = "UNKNOWN";
    /**
     * Content was successfully resolved.
     */
    ResolvedContentStatus["Resolved"] = "RESOLVED";
    /**
     * Content was not found.
     */
    ResolvedContentStatus["NotFound"] = "NOTFOUND";
    /**
     * Request needs to be authorized to be able to
     * resolve the content.
     */
    ResolvedContentStatus["Unauthorized"] = "UNAUTHORIZED";
    /**
     * Request was authorized but didn't have sufficient
     * access rights to be able to resolve the content.
     */
    ResolvedContentStatus["AccessDenied"] = "ACCESSDENIED";
})(ResolvedContentStatus || (ResolvedContentStatus = {}));
/**
 * Class for resolving content.
 */
export class ContentResolver {
    /**
     * Constructs an instance of ContentResolver.
     *
     * @param config - Optional configuration to use. The configuration is
     * combined with the default configuration specified in defaultConfig.
     */
    constructor(config) {
        _api.set(this, void 0);
        __classPrivateFieldSet(this, _api, new ApiClient(Object.assign(Object.assign({}, defaultConfig), config)));
    }
    /**
     * Resolve content from an URL.
     *
     * @param url - URL to resolve.
     * @param matchExact - Match the URL exactly or patially.
     * @param request - Additional request parameters.
     * @returns A promise with a ResolvedContent regardless the content was successfully resolved or not.
     * Check the status property whether the resolving was successful.
     * If the service returned a server error, the promise is rejected with a ContentResolverError.
     */
    resolveContent(url, matchExact, request) {
        const parameters = Object.assign({ 'contentUrl': url, 'matchExact': matchExact }, __classPrivateFieldGet(this, _api).getDefaultParameters(request === null || request === void 0 ? void 0 : request.select, request === null || request === void 0 ? void 0 : request.expand));
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
                    mode: (_a = ContextMode[response.headers['x-epi-contextmode']]) !== null && _a !== void 0 ? _a : ContextMode.Default,
                    remainingPath: response.headers['x-epi-remainingroute'],
                    siteId: response.headers['x-epi-siteid'],
                    startPageId: response.headers['x-epi-startpageguid'],
                };
                resolve(result);
            }).catch((error) => {
                reject(mapToError(error));
            });
        });
    }
}
_api = new WeakMap();
function mapToError(error) {
    return {
        errorMessage: error.statusText,
    };
}
//# sourceMappingURL=contentResolver.js.map