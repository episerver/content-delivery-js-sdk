import { ContentDeliveryConfig } from './config.mjs';
/**
 * Interface describing a response from the API.
 */
export interface ApiResponse {
    /**
     * HTTP status code from the API.
     */
    status: number;
    /**
     * Status text.
     */
    statusText: string;
    /**
     * The requested resource.
     */
    data?: any;
    /**
     * Headers associated with the resource.
     */
    headers: Map<string, string>;
    /**
     * True if the response has status between 200 and 299.
     */
    ok: boolean;
}
/**
 * Interface describing an error from the API.
 */
export interface ApiError {
    /**
     * HTTP status code from the API.
     */
    status?: number;
    /**
     * Status text.
     */
    statusText?: string;
    /**
     * Data if any.
     */
    data?: any;
}
/**
 * Interface describing the default API parameters.
 */
export interface ApiParameters extends Record<string, any> {
    /**
     * Properties to include in the response.
     */
    select?: string;
    /**
    * Properties to expand in the response.
    */
    expand?: string;
    /**
    * Number of items to fetch per set.
    */
    top?: number;
}
/**
 * Interface describing the default API headers.
 */
export interface ApiHeaders extends Record<string, any> {
    /**
     * Branch of the content.
     */
    'Accept-Language'?: string;
    /**
     * Continuation token to fetch next set of items.
     */
    'x-epi-continuation'?: string;
}
/**
 * Class for making API calls to the Content Delivery API.
 */
export declare class ApiClient {
    #private;
    /**
     * Constructs an instance of ApiClient.
     *
     * @param config Configuration to use.
     */
    constructor(config: ContentDeliveryConfig);
    /**
     * Make a GET request.
     *
     * @param path - Path to request.
     * @param parameters - Parameters to include in the request.
     * @param headers - Headers to include in the request.
     * @returns A promise with an ApiRespone if the request was successful, otherwise rejected with an ApiError.
     */
    get(path: string, parameters?: ApiParameters, headers?: ApiHeaders): Promise<ApiResponse>;
    /**
     * Get default API parameters to use when making requests.
     *
     * @param select - Properties to include in the response. All by default, unless configured differently.
     * @param expand - Properties to expand in the response. None by default, unless configured differently.
     * @returns Default parameters combined with the default configuration.
     */
    getDefaultParameters(select?: Array<string>, expand?: Array<string>): ApiParameters;
    /**
     * Get default API headers to use when making requests.
     *
     * @param branch - Branch of the content.
     * @returns Default headers combined with the default configuration.
     */
    getDefaultHeaders(branch?: string): ApiHeaders;
}
//# sourceMappingURL=apiClient.d.mts.map