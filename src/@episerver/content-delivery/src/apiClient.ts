import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ContentDeliveryConfig } from './config';

/**
 * Interface describing the default API parameters.
 */
export interface ApiParameters {
  /**
   * Properties to include in the response.
   */
  select?: string,
  /**
   * Properties to expand in the response.
   */
  expand?: string,

  /**
   * Number of items to fetch per set.
   */
  top?: number,
}

/**
 * Interface describing the default API headers.
 */
export interface ApiHeaders {
  /**
   * Branch of the content.
   */
  ['Accept-Language']?: string,

  /**
   * Continuation token to fetch next set of items.
   */
  ['x-epi-continuation']?: string,
}

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
  async get(path: string, parameters?: ApiParameters, headers?: ApiHeaders): Promise<AxiosResponse<any>> {
    const config: AxiosRequestConfig = {
      method: 'get',
      baseURL: this.#config.apiUrl,
      params: parameters,
      headers: headers || {},
      withCredentials: true,
    };

    if (this.#config.getAccessToken) {
      const accessToken = await this.#config.getAccessToken(path);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    const instance = axios.create(config);

    if (this.#onBeforeRequest) {
      instance.interceptors.request.use(this.#onBeforeRequest);
    }

    return instance.get(path);
  }

  /**
   * Get default API parameters to use when making requests.
   * 
   * @param select - Properties to include in the response. All by default, unless configured differently.
   * @param expand - Properties to expand in the response. None by default, unless configured differently.
   * @returns Default parameters combined with the default configuration.
   */
  getDefaultParameters(select?: Array<string>, expand?: Array<string>) : ApiParameters {
    return {
      select: select ? select.join() : this.#config.selectAllProperties ? undefined : 'name',
      expand: expand ? expand.join() : this.#config.expandAllProperties ? '*' : undefined,
    };
  }

  /**
   * Get default API headers to use when making requests.
   * 
   * @param branch - Branch of the content.
   * @returns Default headers combined with the default configuration.
   */
  getDefaultHeaders(branch?: string) : ApiHeaders {
    return {
      ['Accept-Language']: branch ? branch : '*'
    };
  }
}
