import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ContentDeliveryConfig } from './config';

export class ApiClient {
  readonly #config: ContentDeliveryConfig;
  #onConfig?: (config: AxiosRequestConfig) => AxiosRequestConfig;

  constructor(config: ContentDeliveryConfig) {
    this.#config = config;
  }

  set onConfig(onConfig: (config: AxiosRequestConfig) => AxiosRequestConfig) {
    this.#onConfig = onConfig;
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
      });
    }

    var instance = axios.create(config);

    if (this.#onConfig) {
      instance.interceptors.request.use(this.#onConfig);
    }

    return instance.get(path);
  }
}
