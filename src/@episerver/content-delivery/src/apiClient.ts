import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ContentDeliveryConfig } from './config';

export class ApiClient {
  readonly config: ContentDeliveryConfig;

  constructor(config: ContentDeliveryConfig) {
    this.config = config;
  }

  get(path: string, parameters?: any, headers?: any): Promise<AxiosResponse<any>> {
    const config: AxiosRequestConfig = {
        method: 'get',
        baseURL: this.config.apiUrl,
        params: parameters,
        headers: { ...headers },
    };

    if (this.config.getAccessToken !== undefined) {
      this.config.getAccessToken(path).then((accessToken) => {
        config.headers.Authorization = `Bearer ${accessToken}`;
      });
    }

    return axios.get(path, config);
  }
}
