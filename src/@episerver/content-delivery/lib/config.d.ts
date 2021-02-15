export declare type ContentDeliveryConfig = {
    apiUrl: string;
    getAccessToken?: (path?: string) => Promise<string>;
};
export declare const defaultConfig: ContentDeliveryConfig;
