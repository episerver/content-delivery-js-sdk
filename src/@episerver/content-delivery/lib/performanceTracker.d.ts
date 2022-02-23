import { ApiResponse } from './apiClient';
/**
 * Class for tracking and outputing friendly performance messages to the console.
 */
export declare class PerformanceTracker {
    startTime: number;
    contentLink: string;
    heading: string;
    /**
     * Start tracking a call
     *
     * @param heading - A friendly heading that will be displayed in the console.
     * @param contentLink - Identifier of the content. Could be a guid or a url.
     */
    begin(heading: string, contentLink: string): void;
    /**
     * End the tracking and output a summary to the console
     *
     * @param response - The response gotten from the REST API call.
     */
    end(response: ApiResponse): void;
}
//# sourceMappingURL=performanceTracker.d.ts.map