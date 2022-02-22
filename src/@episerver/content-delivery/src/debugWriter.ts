import { ApiResponse } from './apiClient';

export class DebugWriter {
    write(heading: string, startTime: number, response: ApiResponse): void {
        const endTime = Date.now();
        console.log(heading);
        console.log('Time (ms): ', endTime - startTime);
        console.log('Size (bytes): ', response.headers.get('content-length'));
        console.log('Response: ', response);
      }
}