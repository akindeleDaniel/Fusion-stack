"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({ error: err.message });
});
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
// validation
function validateUsers(req, res, next) {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email reqiured' });
    }
    return next();
}
// authorization
function authorization(req, res, next) {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== "12345") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    return next();
}
app.use(logger);
app.use(requestCounter);
const users = [];
app.get("/", (req, res) => {
    res.json({ message: "Hello!" });
});
app.get('/secret', authorization, (req, res) => {
    res.json({ message: 'Secret unlocked' });
});
app.get('/profile', logger, authorization, (req, res) => {
    res.json({ Name: 'Danny', Role: 'Admin' });
});
app.post('/register', (req, res) => {
    const { firstName, lastName, email, dateOfBirth, password, gender } = req.body;
    if (!firstName || !lastName || !email || !dateOfBirth || !password || !gender) {
        res.status(400).json({ message: 'All areas reqiured' });
        return;
    }
    const newUser = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        password,
        gender
    };
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    const dobFormat = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/;
    if (!dobFormat.test(dateOfBirth)) {
        res.status(400).json({ error: 'Invalid date of birth format' });
        return;
    }
    users.push(newUser);
    res.status(200).json({ message: 'Registration sucessful', data: newUser });
});
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=memory.js.map