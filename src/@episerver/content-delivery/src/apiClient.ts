import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ContentDeliveryConfig } from './config';

export class ApiClient {
  readonly #config: ContentDeliveryConfig;
  #onBeforeRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig;

  constructor(config: ContentDeliveryConfig) {
    this.#config = config;
  }

  set onBeforeRequest(onBeforeRequest: (config: AxiosRequestConfig) => AxiosRequestConfig) {
    this.#onBeforeRequest = onBeforeRequest;
  }

  get(path: string, parameters?: any, headers?: any): Promise<AxiosResponse<any>> {
    const config: AxiosRequestConfig = {
        method: 'get',
        baseURL: this.#config.apiUrl,
        params: parameters,
        headers: { ...headers },
    };

    if (this.#config.getAccessToken) {
      this.#config.getAccessToken(path).then((accessToken) => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.withCredentials = true;
      });
    }

    var instance = axios.create(config);

    if (this.#onBeforeRequest) {
      instance.interceptors.request.use(this.#onBeforeRequest);
    }

    return instance.get(path);
  }
}
