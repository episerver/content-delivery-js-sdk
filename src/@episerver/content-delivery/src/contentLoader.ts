import { AxiosError, AxiosResponse } from 'axios';
import { ApiClient } from './apiClient';
import { ContentDeliveryConfig, defaultConfig } from './config';
import { ContentData } from './models';

/**
 * Type describing a content loader error.
 * 
 * @typeparam T - Type of the additional error data. 
 */
export type ContentLoaderError<T = any> = {
  /**
   * Additional error data. Can be undefined.
   */
  data?: T | undefined,
  /**
   * HTTP status code.
   */
  statusCode: number,
  /**
   * Message describing the error.
   */
  errorMessage: string,
}

/**
 * Class for loading content.
 */
export class ContentLoader {
  readonly #api: ApiClient;

  /**
   * Constructs an instance of ContentLoader.
   * 
   * @param config - Optional configuration to use. The configuration is
   * combined with the default configuration specified in defaultConfig.
   */
  constructor(config?: Partial<ContentDeliveryConfig>) {
    this.#api = new ApiClient({ ...defaultConfig, ...config });
  }

  /**
   * Get content by an identifier.
   * 
   * @param id - Identifier of the content.
   * @param branch - Branch of the content. 
   * @param select - Properties to include in the response. All by default.
   * @param expand - Properties to expand in the response. All by default.
   * @returns A promise with a ContentData if the content was found, otherwise rejected with a ContentLoaderError.
   */
  getContent<T extends ContentData>(id: string, branch: string = '*', select?: Array<string>, expand?: Array<string>): Promise<T> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select ? select.join() : null,
      'expand': expand ? expand.join() : '*',
    };

    return new Promise<T>((resolve, reject) => {
      this.#api.get(`/content/${id}`, parameters, headers).then((response: AxiosResponse<any>) => {
        resolve(response.data as T);
      }).catch((error: AxiosError<any>) => {
        reject(MapAxiosErrorToContentLoaderError<T>(error));
      });
    });
  }

  /**
   * Get child content by an identifier.
   * 
   * @param id - Identifier of the parent content.
   * @param branch - Branch of the content. 
   * @param select - Properties to include in the response. All by default.
   * @param expand - Properties to expand in the response. All by default.
   * @returns A promise with an array of ContentData, otherwise rejected with a ContentLoaderError.
   */
  getChildren<T extends ContentData, R = Array<T>>(id: string, branch: string = '*', select?: Array<string>, expand?: Array<string>): Promise<R> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select ? select.join() : null,
      'expand': expand ? expand.join() : '*',
    };

    return new Promise<R>((resolve, reject) => {
      this.#api.get(`/content/${id}/children`, parameters, headers).then((response: AxiosResponse<any>) => {
        resolve(response.data as R);
      }).catch((error: AxiosError<any>) => {
        reject(MapAxiosErrorToContentLoaderError<T>(error));
      });
    });
  }

  /**
   * Get ancestor content by an identifier.
   * 
   * @param parentId - Identifier of the content.
   * @param branch - Branch of the content. 
   * @param select - Properties to include in the response. All by default.
   * @param expand - Properties to expand in the response. All by default.
   * @returns A promise with an array of ContentData, otherwise rejected with a ContentLoaderError.
   */
  getAncestors<T extends ContentData, R = Array<T>>(id: string, branch: string = '*', select?: Array<string>, expand?: Array<string>): Promise<R> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select ? select.join() : null,
      'expand': expand ? expand.join() : '*',
    };

    return new Promise<R>((resolve, reject) => {
      this.#api.get(`/content/${id}/ancestors`, parameters, headers).then((response: AxiosResponse<any>) => {
        resolve(response.data as R);
      }).catch((error: AxiosError<any>) => {
        reject(MapAxiosErrorToContentLoaderError<T>(error));
      });
    });
  }
}

function MapAxiosErrorToContentLoaderError<T = any>(error: AxiosError<any>): ContentLoaderError<T> {
  if (error.response) {
    return {
      data: error.response.data,
      statusCode: error.response.status,
      errorMessage: error.response.statusText,
    }
  }

  return {
    statusCode: 0,
    errorMessage: error.message,
  };
}
