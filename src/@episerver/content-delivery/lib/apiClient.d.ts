import { AxiosResponse } from 'axios';
import { ContentDeliveryConfig } from './config';
export declare class ApiClient {
    readonly config: ContentDeliveryConfig;
    constructor(config: ContentDeliveryConfig);
    get(path: string, parameters?: any, headers?: any): Promise<AxiosResponse<any>>;
}
