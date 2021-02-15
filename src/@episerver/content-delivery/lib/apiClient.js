"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiClient {
    constructor(config) {
        this.config = config;
    }
    get(path, parameters, headers) {
        const config = {
            method: 'get',
            baseURL: this.config.apiUrl,
            params: parameters,
            headers: Object.assign({}, headers),
        };
        if (this.config.getAccessToken !== undefined) {
            this.config.getAccessToken(path).then((accessToken) => {
                config.headers.Authorization = `Bearer ${accessToken}`;
            });
        }
        return axios_1.default.get(path, config);
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=apiClient.js.map