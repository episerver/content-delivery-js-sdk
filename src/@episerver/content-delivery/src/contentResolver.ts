import { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiClient } from './apiClient';
import { ContentDeliveryConfig, defaultConfig } from './config';
import { ContentData, ContextMode } from './models';

export enum ResolvedContentStatus
{
  Unknown = 'UNKNOWN',
  Resolved = 'RESOLVED',
  NotFound = 'NOTFOUND',
  Unauthorized = 'UNAUTHORIZED',
  AccessDenied = 'ACCESSDENIED',
}

export interface ResolvedContent<T extends ContentData> {
  content: T | undefined,
  branch: string,
  status: ResolvedContentStatus
  mode: ContextMode,
  remainingPath: string,
  site: string,
  startPage: string,
}

export type ContentResolverError = {
  statusText: string,
}

export class ContentResolver {
  readonly #api: ApiClient;

  constructor(config?: Partial<ContentDeliveryConfig>) {
    this.#api = new ApiClient({ ...defaultConfig, ...config });

    this.#api.onBeforeRequest = (config: AxiosRequestConfig) => { 
      config.validateStatus = (status: number) => {
        // When resolving content we want to return ResolvedContent
        // regardless the content was found or not.
        return status >= 200 && status < 500;
      };

      return config;
    };
  }

  resolveContent<T extends ContentData>(url: string, matchExact: boolean, select?: Array<string>, expand: Array<string> = ['*']): Promise<ResolvedContent<T>> {
    const parameters = {
      'contentUrl': url,
      'matchExact': matchExact,
      'select': select?.join(),
      'expand': expand?.join(),
    };

    return new Promise<ResolvedContent<T>>((resolve, reject) => {
      this.#api.get('/content', parameters).then((response: AxiosResponse<any>) => {
        const contentData = response.data as Array<T>;        
        let status = ResolvedContentStatus.Unknown;
        let content: T | undefined;

        switch (response.status) {
          case 401:
            status = ResolvedContentStatus.Unauthorized;
            break;
          case 403:
            status = ResolvedContentStatus.AccessDenied;
             break;
          case 404:
            status = ResolvedContentStatus.NotFound;
            break;
          default:
            if (contentData?.length > 0) {
              status = ResolvedContentStatus.Resolved;
              content = contentData[0];
            } else {
              status = ResolvedContentStatus.NotFound;
            }
            break;
        };

        const result = {
          content: content,
          branch: response.headers['x-epi-branch'],
          status: status,
          mode: (<any>ContextMode)[response.headers['x-epi-contextmode']] ?? ContextMode.Default,
          remainingPath: response.headers['x-epi-remainingroute'],
          site: response.headers['x-epi-siteid'],
          startPage: response.headers['x-epi-startpageguid'],
        };

        resolve(result as ResolvedContent<T>);
      }).catch((error: AxiosError<any>) => {
        reject(MapAxiosErrorToContentResolverError(error));
      });
    });
  }
}

function MapAxiosErrorToContentResolverError(error: AxiosError<any>): ContentResolverError {
  return {
    statusText: error.message,
  };
}
