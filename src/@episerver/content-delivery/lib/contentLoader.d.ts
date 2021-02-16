import { ContentDeliveryConfig } from './config';
import { ContentData } from './models';
export declare type ContentLoaderError<T = any> = {
    data?: T;
    status: number;
    statusText: string;
};
export declare class ContentLoader {
    #private;
    constructor(config?: Partial<ContentDeliveryConfig>);
    getContent<T extends ContentData>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<T>;
    getChildren<T extends ContentData, R = Array<T>>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<R>;
    getAncestors<T extends ContentData, R = Array<T>>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<R>;
}
