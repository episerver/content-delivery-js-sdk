import { AxiosError, AxiosResponse } from 'axios';
import { ApiClient } from './apiClient';
import { ContentDeliveryConfig, defaultConfig } from './config';
import { ContentData } from './models';

export type ContentLoaderError<T = any> = {
  data?: T,
  status: number,
  statusText: string,
}

export class ContentLoader {
  readonly #api: ApiClient;

  constructor(config?: Partial<ContentDeliveryConfig>) {
    this.#api = new ApiClient({ ...defaultConfig, ...config });
  }

  getContent<T extends ContentData>(id: string, branch: string = '*', select?: Array<string>, expand: Array<string> = ['*']): Promise<T> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select?.join(),
      'expand': expand?.join(),
    };

    return new Promise<T>((resolve, reject) => {
      this.#api.get(`/content/${id}`, parameters, headers).then((response: AxiosResponse<any>) => {
        resolve(response.data as T);
      }).catch((error: AxiosError<any>) => {
        reject(MapAxiosErrorToContentLoaderError<T>(error));
      });
    });
  }

  getChildren<T extends ContentData, R = Array<T>>(id: string, branch: string = '*', select?: Array<string>, expand: Array<string> = ['*']): Promise<R> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select?.join(),
      'expand': expand?.join(),
    };

    return new Promise<R>((resolve, reject) => {
      this.#api.get(`/content/${id}/children`, parameters, headers).then((response: AxiosResponse<any>) => {
        resolve(response.data as R);
      }).catch((error: AxiosError<any>) => {
        reject(MapAxiosErrorToContentLoaderError<T>(error));
      });
    });
  }

  getAncestors<T extends ContentData, R = Array<T>>(id: string, branch: string = '*', select?: Array<string>, expand: Array<string> = ['*']): Promise<R> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select?.join(),
      'expand': expand?.join(),
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
      status: error.response.status,
      statusText: error.response.statusText,
    }
  }

  return {
    status: 0,
    statusText: error.message,
  };
}
