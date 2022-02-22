"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugWriter = void 0;
class DebugWriter {
    write(heading, startTime, response) {
        const endTime = Date.now();
        console.log(heading);
        console.log('Time (ms): ', endTime - startTime);
        console.log('Size (bytes): ', response.headers.get('content-length'));
        console.log('Response: ', response);
    }
}
exports.DebugWriter = DebugWriter;
//# sourceMappingURL=debugWriter.js.map