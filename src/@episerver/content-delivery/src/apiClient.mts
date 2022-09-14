import { ContentDeliveryConfig } from './config.mjs';

/**
 * Interface describing a response from the API.
 */
export interface ApiResponse {
  /**
   * HTTP status code from the API.
   */
  status: number,

  /**
   * Status text.
   */
  statusText: string,

  /**
   * The requested resource.
   */
  data?: any,

  /**
   * Headers associated with the resource.
   */
  headers: Map<string, string>,

  /**
   * True if the response has status between 200 and 299.
   */
  ok: boolean,
}

/**
 * Interface describing an error from the API.
 */
export interface ApiError {
  /**
   * HTTP status code from the API.
   */
  status?: number,

  /**
   * Status text.
   */
  statusText?: string,

  /**
   * Data if any.
   */
  data?: any,
}

/**
 * Interface describing the default API parameters.
 */
export interface ApiParameters extends Record<string, any> {
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
export interface ApiHeaders extends Record<string, any> {
  /**
   * Branch of the content.
   */
  'Accept-Language'?: string,

  /**
   * Continuation token to fetch next set of items.
   */
  'x-epi-continuation'?: string,
}

/**
 * Class for making API calls to the Content Delivery API.
 */
export class ApiClient {
  readonly #config: ContentDeliveryConfig;

  /**
   * Constructs an instance of ApiClient.
   *
   * @param config Configuration to use.
   */
  constructor(config: ContentDeliveryConfig) {
    this.#config = config;
  }

  /**
   * Make a GET request.
   *
   * @param path - Path to request.
   * @param parameters - Parameters to include in the request.
   * @param headers - Headers to include in the request.
   * @returns A promise with an ApiRespone if the request was successful, otherwise rejected with an ApiError.
   */
  async get(path: string, parameters: ApiParameters = {}, headers: ApiHeaders = {}): Promise<ApiResponse> {
    let requestUrl = getUrl(this.#config.apiUrl, path, parameters);

    if (this.#config.getUrl) {
      requestUrl = await this.#config.getUrl(requestUrl);
    }

    const request: RequestInit = {
      method: 'get',
      credentials: 'include',
      headers: await getHeaders(path, headers, this.#config),
    };

    return new Promise<ApiResponse>((resolve, reject) => {
      fetch(requestUrl, request).then(async (response: Response) => {
        const result: ApiResponse = {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: new Map(),
          data: await response.json().catch(() => { }),
        };

        response.headers.forEach((value: string, key: string) => {
          result.headers.set(key, value);
        })

        resolve(result);
      }).catch((error: any) => {
        reject(mapToError(error));
      });
    });
  }

  /**
   * Get default API parameters to use when making requests.
   *
   * @param select - Properties to include in the response. All by default, unless configured differently.
   * @param expand - Properties to expand in the response. None by default, unless configured differently.
   * @returns Default parameters combined with the default configuration.
   */
  getDefaultParameters(select?: Array<string>, expand?: Array<string>): ApiParameters {
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
  getDefaultHeaders(branch?: string): ApiHeaders {
    return {
      'Accept-Language': branch ? branch : undefined
    };
  }
}

async function getHeaders(path: string, headers: ApiHeaders = {}, config: ContentDeliveryConfig): Promise<Headers> {
  let result = new Headers();

  for (const name in headers) {
    if (headers[name] !== undefined) {
      result.set(name, headers[name]);
    }
  }

  if (config.getHeaders) {
    const configHeaders = await config.getHeaders(path);
    if (configHeaders) {
      for (const name in configHeaders) {
        if (configHeaders[name] !== undefined) {
          result.set(name, configHeaders[name])
        }
      }
    }
  }

  if (config.getAccessToken) {
    const accessToken = await config.getAccessToken(path);
    if (accessToken) {
      result.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  return Promise.resolve(result);
}

function getUrl(baseUrl: string, path: string, parameters: ApiParameters = {}): string {
  const tempHostname = 'http://temp';

  // The temporary host will only be used when baseUrl is relative.
  let url = new URL(baseUrl, tempHostname);

  if (url.pathname.endsWith('/')) {
    url.pathname = url.pathname + path;
  } else {
    url.pathname = url.pathname + '/' + path;
  }

  for (const key in parameters) {
    if (parameters[key] !== undefined) {
      url.searchParams.set(key, parameters[key]);
    }
  }

  // Return relative URL if input was relative.
  return url.hostname === tempHostname
    ? url.pathname + url.search
    : url.toString();
}

function mapToError(error: any): ApiError {
  let result: ApiError = {};

  if (typeof error.json === 'function') {
    error.json().then((jsonError: any) => {
      result.data = jsonError;
    }).catch((errorResponse: Response) => {
      result.status = errorResponse.status;
      result.statusText = errorResponse.statusText;
    });
  } else {
    result.statusText = error;
  }

  return result;
}
