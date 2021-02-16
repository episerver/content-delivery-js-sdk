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
var _config, _onConfig;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiClient {
    constructor(config) {
        _config.set(this, void 0);
        _onConfig.set(this, void 0);
        __classPrivateFieldSet(this, _config, config);
    }
    set onConfig(onConfig) {
        __classPrivateFieldSet(this, _onConfig, onConfig);
    }
    get(path, parameters, headers) {
        const config = {
            method: 'get',
            baseURL: __classPrivateFieldGet(this, _config).apiUrl,
            params: parameters,
            headers: Object.assign({}, headers),
        };
        if (__classPrivateFieldGet(this, _config).getAccessToken) {
            __classPrivateFieldGet(this, _config).getAccessToken(path).then((accessToken) => {
                config.headers.Authorization = `Bearer ${accessToken}`;
            });
        }
        var instance = axios_1.default.create(config);
        if (__classPrivateFieldGet(this, _onConfig)) {
            instance.interceptors.request.use(__classPrivateFieldGet(this, _onConfig));
        }
        return instance.get(path);
    }
}
exports.ApiClient = ApiClient;
_config = new WeakMap(), _onConfig = new WeakMap();
//# sourceMappingURL=apiClient.js.map