import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiClient {
  readonly apiUrl: string;
  readonly accessToken: string | undefined;
  
  constructor(apiUrl: string, accessToken?: string) {
    this.apiUrl = apiUrl;
    this.accessToken = accessToken;
  }

  get(path: string, parameters?: any, headers?: any): Promise<AxiosResponse<any>> {
    const config: AxiosRequestConfig = {
        method: 'get',
        baseURL: this.apiUrl,
        params: parameters,
        headers: { ...headers },
    };

    if (this.accessToken !== null) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return axios.get(path, config);
  }
}
