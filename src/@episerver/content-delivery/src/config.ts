export type ContentDeliveryConfig = {
  apiUrl: string;
  getAccessToken?: (path?: string) => Promise<string>,
};
  
export const defaultConfig: ContentDeliveryConfig = { 
  apiUrl: '/' 
}
