import { ContentDeliveryConfig } from './config.mjs';
import { ContentData, ContextMode } from './models.mjs';
/**
 * Interface describing additional request parameters
 * for resolving content.
 */
export interface ResolveContentRequest {
    /**
     * Properties to include in the response.
     * All by default, unless configured differently.
     */
    select?: Array<string>;
    /**
     * Properties to expand in the response.
     * None by default, unless configured differently.
     */
    expand?: Array<string>;
}
/**
 * Enum describing the status of the resolved content.
 */
export declare enum ResolvedContentStatus {
    /**
     * Content was unsuccessfully resolved due to
     * unknown reasons.
     */
    Unknown = "UNKNOWN",
    /**
     * Content was successfully resolved.
     */
    Resolved = "RESOLVED",
    /**
     * Content was not found.
     */
    NotFound = "NOTFOUND",
    /**
     * Request needs to be authorized to be able to
     * resolve the content.
     */
    Unauthorized = "UNAUTHORIZED",
    /**
     * Request was authorized but didn't have sufficient
     * access rights to be able to resolve the content.
     */
    AccessDenied = "ACCESSDENIED"
}
/**
 * Interface describing resolved content.
 *
 * @typeparam T - Type of content that is being resolved.
 */
export interface ResolvedContent<T extends ContentData> {
    /**
     * Content that was resolved. Can be undefined if no
     * content was resolved
     */
    content?: T;
    /**
     * Branch that was resolved.
     */
    branch?: string;
    /**
     * Status of the resolved content.
     */
    status: ResolvedContentStatus;
    /**
     * Context mode the content was resolved in.
     */
    mode: ContextMode;
    /**
     * Rremaining path of the URL if the content was partially matched.
     */
    remainingPath?: string;
    /**
     * Identifier of the site the content belongs to.
     */
    siteId?: string;
    /**
     * Identifier of the start page the content belongs to.
     */
    startPageId?: string;
}
/**
 * Interface describing a content resolving error.
 */
export declare type ContentResolverError = {
    /**
     * Message describing the error.
     */
    errorMessage?: string;
};
/**
 * Class for resolving content.
 */
export declare class ContentResolver {
    #private;
    /**
     * Constructs an instance of ContentResolver.
     *
     * @param config - Optional configuration to use. The configuration is
     * combined with the default configuration specified in defaultConfig.
     */
    constructor(config?: Partial<ContentDeliveryConfig>);
    /**
     * Resolve content from an URL.
     *
     * @param url - URL to resolve.
     * @param matchExact - Match the URL exactly or patially.
     * @param request - Additional request parameters.
     * @returns A promise with a ResolvedContent regardless the content was successfully resolved or not.
     * Check the status property whether the resolving was successful.
     * If the service returned a server error, the promise is rejected with a ContentResolverError.
     */
    resolveContent<T extends ContentData>(url: string, matchExact: boolean, request?: ResolveContentRequest): Promise<ResolvedContent<T>>;
}
//# sourceMappingURL=contentResolver.d.mts.map