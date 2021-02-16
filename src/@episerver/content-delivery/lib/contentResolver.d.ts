import { ContentDeliveryConfig } from './config';
import { ContentData, ContextMode } from './models';
export declare enum ResolvedContentStatus {
    Unknown = 0,
    Resolved = 1,
    NotFound = 2,
    Unauthorized = 3,
    AccessDenied = 4
}
export interface ResolvedContent<T extends ContentData> {
    content: T | undefined;
    branch: string;
    status: ResolvedContentStatus;
    mode: ContextMode;
    remainingPath: string;
    site: string;
    startPage: string;
}
export declare type ContentResolverError = {
    statusText: string;
};
export declare class ContentResolver {
    #private;
    constructor(config?: Partial<ContentDeliveryConfig>);
    resolveContent<T extends ContentData>(url: string, matchExact: boolean, select?: Array<string>, expand?: Array<string>): Promise<ResolvedContent<T>>;
}
