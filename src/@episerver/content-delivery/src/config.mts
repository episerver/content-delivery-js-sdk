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

  /**
   * Function to call to include custom headers in
   * requests to the Content Delivery API.
   */
  getHeaders?: (path?: string) => Promise<Record<string, any>>,

  /**
   * Function to call to change the URL before a
   * requests to the Content Delivery API.
   */
  getUrl?: (url: string) => Promise<string>,

  /**
   * Select all properties by default, unless otherwise
   * specified in each request to the Content Delivery API.
   */
  selectAllProperties: boolean,

  /**
   * Expand all properties by default, unless otherwise
   * specified in each request to the Content Delivery API.
   */
  expandAllProperties: boolean,
};

/**
 * Default configuration to use when making requests to the
 * Content Delivery API.
 */
export const defaultConfig: ContentDeliveryConfig = {
  apiUrl: '/',
  selectAllProperties: true,
  expandAllProperties: false,
}
