"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTracker = void 0;
const config_1 = require("./config");
class PerformanceTracker {
    constructor() {
        this.startTime = 0;
        this.contentLink = "";
        this.heading = "";
    }
    begin(heading, startTime, contentLink) {
        this.startTime = startTime;
        this.contentLink = contentLink;
        this.heading = heading;
    }
    end(response) {
        if (!config_1.defaultConfig.enablePerformanceTracking) {
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
exports.PerformanceTracker = PerformanceTracker;
//# sourceMappingURL=performanceTracker.js.map