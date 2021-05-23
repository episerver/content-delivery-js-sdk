import { ApiClient, ApiResponse, ApiError } from './apiClient';
import { ContentDeliveryConfig, defaultConfig } from './config';
import { SiteDefinition } from './models';

/**
 * Type describing a site loader error.
 * 
 * @typeparam T - Type of the additional error data. 
 */
export type SiteLoaderError = {
  /**
   * HTTP status code.
   */
  errorCode?: number,

  /**
   * Message describing the error.
   */
  errorMessage?: string,
}

/**
 * Class for loading sites.
 */
export class SiteLoader {
  readonly #api: ApiClient;

  /**
   * Constructs an instance of SiteLoader.
   * 
   * @param config - Optional configuration to use. The configuration is
   * combined with the default configuration specified in defaultConfig.
   */
  constructor(config?: Partial<ContentDeliveryConfig>) {
    this.#api = new ApiClient({ ...defaultConfig, ...config });
  }
  
  /**
   * Get site by an identifier.
   * 
   * @param id - Identifier of the site.
   * @returns A promise with a SiteDefinition if the site was found, otherwise rejected with a SiteLoaderError.
   */
  getSite<T extends SiteDefinition>(id: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.#api.get(`/site/${id}`).then((response: ApiResponse) => {
        if (response.ok) {
          resolve(response.data as T);
        } else {
          reject(mapResponseToError(response));
        }
      }).catch((error: ApiError) => {
        reject(mapToError(error));
      });
    });
  }

  /**
 * List all sites.
 * 
 * @returns A promise with an array of SiteDefinition. Otherwise rejected with a SiteLoaderError.
 */
  getSites<T extends SiteDefinition>(): Promise<Array<T>> {
    return new Promise<Array<T>>((resolve, reject) => {
      this.#api.get(`/site/`).then((response: ApiResponse) => {
        if (response.ok) {
          resolve(response.data);
        } else {
          reject(mapResponseToError(response));
        }
      }).catch((error: ApiError) => {
        reject(mapToError(error));
      });
    });
  }
}

function mapResponseToError(response: ApiResponse): SiteLoaderError {
  return {
    errorCode: response.status,
    errorMessage: response.statusText,
  }
}

function mapToError(error: ApiError): SiteLoaderError {
  return {
    errorMessage: error.statusText,
  }
}
