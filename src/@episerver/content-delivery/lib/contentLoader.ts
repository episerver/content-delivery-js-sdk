import { AxiosResponse } from 'axios';
import { ApiClient } from './apiClient';
import { ContentData } from './models';

export class ContentLoader {
  readonly api: ApiClient;

  constructor(apiUrl: string, accessToken?: string) {
    this.api = new ApiClient(apiUrl, accessToken);
  }

  getContent<T extends ContentData>(id: string, branch: string = '*', select?: Array<string>, expand: Array<string> = ['*']): Promise<T> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select?.join(),
      'expand': expand.join(),
    };

    return new Promise<T>((resolve, reject) => {
      this.api.get(`/content/${id}`, parameters, headers).then((response: AxiosResponse<any>) => {
        resolve(response.data as T);
      }).catch((response: AxiosResponse<any>) => {
        reject(response);
      });
    });
  }

  getChildren<T extends Array<ContentData>>(id: string, branch: string = '*', select?: Array<string>, expand: Array<string> = ['*']): Promise<T> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select?.join(),
      'expand': expand.join(),
    };

    return new Promise<T>((resolve, reject) => {
      this.api.get(`/content/${id}/children`, parameters, headers).then((response: AxiosResponse<any>) => {
        resolve(response.data as T);
      }).catch((response: AxiosResponse<any>) => {
        reject(response);
      });
    });
  }

  getAncestors<T extends Array<ContentData>>(id: string, branch: string = '*', select?: Array<string>, expand: Array<string> = ['*']): Promise<T> {
    const headers = {
      'Accept-Language': branch,
    };

    const parameters = {
      'select': select?.join(),
      'expand': expand.join(),
    };

    return new Promise<T>((resolve, reject) => {
      this.api.get(`/content/${id}/ancestors`, parameters, headers).then((response: AxiosResponse<any>) => {
        resolve(response.data as T);
      }).catch((response: AxiosResponse<any>) => {
        reject(response);
      });
    });
  }
}
