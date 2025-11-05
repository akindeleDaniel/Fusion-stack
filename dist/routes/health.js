"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
exports.router = (0, express_1.Router)();
exports.router.get('/', (req, res) => {
    throw new Error('Application error');
    res.status(202).send({ message: 'OK', timestamp: req.timestamp });
});
//# sourceMappingURL=health.js.map