import { ApiResponse } from './apiClient';
import { defaultConfig } from './config';

export class PerformanceTracker {
    startTime: number = 0;
    contentLink: string = "";
    heading: string = "";

    begin(heading: string, startTime: number, contentLink: string): void{
        this.startTime = startTime;
        this.contentLink = contentLink;
        this.heading = heading;
    }
    
    end(response: ApiResponse): void {
        if (!defaultConfig.enablePerformanceTracking) {
            return;
        }

        const endTime = Date.now();
        console.log(this.heading);
        console.log('Content link: ', this.contentLink);
        console.log('Execution time (ms): ', endTime - this.startTime);
        console.log('Content size (bytes): ', response.headers.get('content-length'));
        console.log('Full response: ', response);
        console.log('----------- End ----------');
      }
}