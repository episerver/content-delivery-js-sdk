import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ContentDeliveryConfig } from './config';
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
     * Sets the function to call for getting an access token
     * to authorize the request.
     *
     * @param onBeforeRequest - Function to use.
     */
    set onBeforeRequest(onBeforeRequest: (config: AxiosRequestConfig) => AxiosRequestConfig);
    /**
     * Make a GET request.
     *
     * @param path - Path to request.
     * @param parameters - Parameters to include in the request.
     * @param headers - Headers to include in the request.
     * @returns A promise with an AxiosResponse if the request was successful, otherwise rejected with an AxiosError.
     */
    get(path: string, parameters?: any, headers?: any): Promise<AxiosResponse<any>>;
}
