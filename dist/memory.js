"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
// logger
function logger(req, res, next) {
    console.log(`${req.url} ${req.method}`);
    next();
}
// requestcounter
let requestCount = 0;
function requestCounter(req, res, next) {
    requestCount++;
    console.log(`Number of request: ${requestCount}`);
    next();
}
function validateUsers(req, res, next) {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email reqiured' });
    }
    return next();
}
app.use(logger);
app.use(requestCounter);
app.get("/", (req, res) => {
    res.json({ message: "Hello!" });
});
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=memory.js.map