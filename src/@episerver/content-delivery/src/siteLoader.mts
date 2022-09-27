import { ApiClient, ApiResponse, ApiError } from './apiClient.mjs';
import { ContentDeliveryConfig, defaultConfig } from './config.mjs';
import { SiteDefinition } from './models.mjs';

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
  getSite(id: string): Promise<SiteDefinition> {
    return new Promise<SiteDefinition>((resolve, reject) => {
      this.#api.get(`site/${encodeURIComponent(id)}`).then((response: ApiResponse) => {
        if (response.ok) {
          resolve(response.data as SiteDefinition);
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
  getSites(): Promise<Array<SiteDefinition>> {
    return new Promise<Array<SiteDefinition>>((resolve, reject) => {
      this.#api.get(`site/`).then((response: ApiResponse) => {
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
