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
var _ContentResolver_api;
import { ApiClient } from './apiClient.mjs';
import { defaultConfig } from './config.mjs';
import { ContextMode } from './models.mjs';
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
        _ContentResolver_api.set(this, void 0);
        __classPrivateFieldSet(this, _ContentResolver_api, new ApiClient(Object.assign(Object.assign({}, defaultConfig), config)), "f");
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
        const parameters = Object.assign({ 'contentUrl': url, 'matchExact': matchExact }, __classPrivateFieldGet(this, _ContentResolver_api, "f").getDefaultParameters(request === null || request === void 0 ? void 0 : request.select, request === null || request === void 0 ? void 0 : request.expand));
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _ContentResolver_api, "f").get('content', parameters).then((response) => {
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
                function parseContextMode(value) {
                    switch (value) {
                        case 'Edit':
                            return ContextMode.Edit;
                        case 'Preview':
                            return ContextMode.Preview;
                        default:
                            return ContextMode.Default;
                    }
                }
                const result = {
                    content: content,
                    branch: response.headers.get('x-epi-branch'),
                    status: status,
                    mode: parseContextMode(response.headers.get('x-epi-contextmode')),
                    remainingPath: response.headers.get('x-epi-remainingroute'),
                    siteId: response.headers.get('x-epi-siteid'),
                    startPageId: response.headers.get('x-epi-startpageguid'),
                };
                resolve(result);
            }).catch((error) => {
                reject(mapToError(error));
            });
        });
    }
}
_ContentResolver_api = new WeakMap();
function mapToError(error) {
    return {
        errorMessage: error.statusText,
    };
}
//# sourceMappingURL=contentResolver.mjs.map