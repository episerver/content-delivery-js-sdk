import { ApiClient } from './apiClient';
import { ContentDeliveryConfig } from './config';
import { ContentData } from './models';
export declare class ContentLoader {
    readonly api: ApiClient;
    constructor(config?: Partial<ContentDeliveryConfig>);
    getContent<T extends ContentData>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<T>;
    getChildren<T extends ContentData, R = Array<T>>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<R>;
    getAncestors<T extends ContentData, R = Array<T>>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<R>;
}
