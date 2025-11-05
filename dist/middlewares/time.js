"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTimestamp = addTimestamp;
function addTimestamp(req, res, next) {
    req.timestamp = Date.now();
    next();
}
//# sourceMappingURL=time.js.map