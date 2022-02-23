import { ApiResponse } from './apiClient';
export declare class PerformanceTracker {
    startTime: number;
    contentLink: string;
    heading: string;
    begin(heading: string, startTime: number, contentLink: string): void;
    end(response: ApiResponse): void;
}
//# sourceMappingURL=performanceTracker.d.ts.map