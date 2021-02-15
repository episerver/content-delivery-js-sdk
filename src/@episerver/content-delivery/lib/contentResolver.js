"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentResolver = exports.ResolvedContentStatus = void 0;
const apiClient_1 = require("./apiClient");
const config_1 = require("./config");
const models_1 = require("./models");
var ResolvedContentStatus;
(function (ResolvedContentStatus) {
    ResolvedContentStatus[ResolvedContentStatus["Unknown"] = 0] = "Unknown";
    ResolvedContentStatus[ResolvedContentStatus["Resolved"] = 1] = "Resolved";
    ResolvedContentStatus[ResolvedContentStatus["NotFound"] = 2] = "NotFound";
    ResolvedContentStatus[ResolvedContentStatus["Unauthorized"] = 3] = "Unauthorized";
    ResolvedContentStatus[ResolvedContentStatus["AccessDenied"] = 4] = "AccessDenied";
})(ResolvedContentStatus = exports.ResolvedContentStatus || (exports.ResolvedContentStatus = {}));
class ContentResolver {
    constructor(config) {
        this.api = new apiClient_1.ApiClient(Object.assign(Object.assign({}, config_1.defaultConfig), config));
    }
    resolveContent(url, matchExact, select, expand = ['*']) {
        const parameters = {
            'contentUrl': url,
            'matchExact': matchExact,
            'select': select === null || select === void 0 ? void 0 : select.join(),
            'expand': expand === null || expand === void 0 ? void 0 : expand.join(),
        };
        return new Promise((resolve, reject) => {
            this.api.get('/content', parameters).then((response) => {
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
            }).catch((response) => {
                reject(response);
            });
        });
    }
}
exports.ContentResolver = ContentResolver;
//# sourceMappingURL=contentResolver.js.map