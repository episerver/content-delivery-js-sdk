import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ContentDeliveryConfig } from './config';

/**
 * Class for making API calls to the Content Delivery API.
 */
export class ApiClient {
  readonly #config: ContentDeliveryConfig;
  #onBeforeRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig;

  /**
   * Constructs an instance of ApiClient.
   * 
   * @param config Configuration to use.
   */
  constructor(config: ContentDeliveryConfig) {
    this.#config = config;
  }

  /**
   * Sets the function to call for getting an access token
   * to authorize the request.
   * 
   * @param onBeforeRequest - Function to use.
   */
  set onBeforeRequest(onBeforeRequest: (config: AxiosRequestConfig) => AxiosRequestConfig) {
    this.#onBeforeRequest = onBeforeRequest;
  }

  /**
   * Make a GET request.
   * 
   * @param path - Path to request.
   * @param parameters - Parameters to include in the request. 
   * @param headers - Headers to include in the request.
   * @returns A promise with an AxiosResponse if the request was successful, otherwise rejected with an AxiosError.
   */
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
