import { AxiosResponse } from 'axios';
import { ApiClient } from './apiClient';
import { ContentData, ContextMode } from './models';

export enum ResolvedContentStatus
{
  Unknown = 0,
  Resolved = 1,
  NotFound = 2,
  Unauthorized = 3,
  AccessDenied = 4,
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

export class ContentResolver {
  readonly api: ApiClient;

  constructor(apiUrl: string, accessToken?: string) {
    this.api = new ApiClient(apiUrl, accessToken);
  }

  resolveContent<T extends ResolvedContent<ContentData>>(url: string, matchExact: boolean, select?: Array<string>, expand: Array<string> = ['*']): Promise<T> {
    const parameters = {
      'contentUrl': url,
      'matchExact': matchExact,
      'select': select?.join(),
      'expand': expand.join(),
    };

    return new Promise<T>((resolve, reject) => {
      this.api.get('/content', parameters).then((response: AxiosResponse<any>) => {
        const contentData = response.data as Array<ContentData>;        
        let status = ResolvedContentStatus.Unknown;
        let content: ContentData | undefined;

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

        resolve(result as T);
      }).catch((response: AxiosResponse<any>) => {
        reject(response);
      });
    });
  }
}
