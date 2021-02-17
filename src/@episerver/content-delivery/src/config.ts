/**
 * Type describing configuration to use when making
 * requests to the Content Delivery API.
 */
export type ContentDeliveryConfig = {
  /**
   * URL to the Content Delivery API.
   */
  apiUrl: string;
  /**
   * Function to call to get an access token for authorizing
   * requests to the Content Delivery API.
   */
  getAccessToken?: (path?: string) => Promise<string>,
};

/**
 * Default configuration to use when making requests to the
 * Content Delivery API.
 */
export const defaultConfig: ContentDeliveryConfig = { 
  apiUrl: '/' 
}
