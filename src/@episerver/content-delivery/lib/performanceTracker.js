"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTracker = void 0;
const config_1 = require("./config");
/**
 * Class for tracking and outputing friendly performance messages to the console.
 */
class PerformanceTracker {
    constructor() {
        this.startTime = 0;
        this.contentLink = "";
        this.heading = "";
    }
    /**
     * Start tracking a call
     *
     * @param heading - A friendly heading that will be displayed in the console.
     * @param contentLink - Identifier of the content. Could be a guid or a url.
     */
    begin(heading, contentLink) {
        this.startTime = Date.now();
        this.contentLink = contentLink;
        this.heading = heading;
    }
    /**
     * End the tracking and output a summary to the console
     *
     * @param response - The response gotten from the REST API call.
     */
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