import { ContentDeliveryConfig } from './config';
import { ContentData } from './models';
/**
 * Type describing a content loader error.
 *
 * @typeparam T - Type of the additional error data.
 */
export declare type ContentLoaderError<T = any> = {
    /**
     * Additional error data. Can be undefined.
     */
    data?: T | undefined;
    /**
     * HTTP status code.
     */
    statusCode: number;
    /**
     * Message describing the error.
     */
    errorMessage: string;
};
/**
 * Class for loading content.
 */
export declare class ContentLoader {
    #private;
    /**
     * Constructs an instance of ContentLoader.
     *
     * @param config - Optional configuration to use. The configuration is
     * combined with the default configuration specified in defaultConfig.
     */
    constructor(config?: Partial<ContentDeliveryConfig>);
    /**
     * Get content by an identifier.
     *
     * @param id - Identifier of the content.
     * @param branch - Branch of the content.
     * @param select - Properties to include in the response. All by default, unless configured differently.
     * @param expand - Properties to expand in the response. None by default, unless configured differently.
     * @returns A promise with a ContentData if the content was found, otherwise rejected with a ContentLoaderError.
     */
    getContent<T extends ContentData>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<T>;
    /**
     * Get child content by an identifier.
     *
     * @param id - Identifier of the parent content.
     * @param branch - Branch of the content.
     * @param select - Properties to include in the response. All by default, unless configured differently.
     * @param expand - Properties to expand in the response. None by default, unless configured differently.
     * @returns A promise with an array of ContentData, otherwise rejected with a ContentLoaderError.
     */
    getChildren<T extends ContentData, R = Array<T>>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<R>;
    /**
     * Get ancestor content by an identifier.
     *
     * @param parentId - Identifier of the content.
     * @param branch - Branch of the content.
     * @param select - Properties to include in the response. All by default, unless configured differently.
     * @param expand - Properties to expand in the response. None by default, unless configured differently.
     * @returns A promise with an array of ContentData, otherwise rejected with a ContentLoaderError.
     */
    getAncestors<T extends ContentData, R = Array<T>>(id: string, branch?: string, select?: Array<string>, expand?: Array<string>): Promise<R>;
}
