"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
const USERS_FILE = "./users.json";
app.use(express_1.default.json());
// ===== Helper functions =====
function readUsers() {
    if (!fs_1.default.existsSync(USERS_FILE))
        return [];
    const data = fs_1.default.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data || "[]");
}
function writeUsers(users) {
    fs_1.default.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
// ===== Routes =====
// REGISTER
app.post("/register", (req, res) => {
    const { firstName, lastName, phone, email, address, password } = req.body;
    if (!firstName || !lastName || !phone || !email || !address || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    const users = readUsers();
    if (users.find((u) => u.email === email)) {
        res.status(409).json({ message: "Email already registered" });
    }
    const newUser = { firstName, lastName, phone, email, address, password };
    users.push(newUser);
    writeUsers(users);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
        message: "Registered successfully",
        user: userWithoutPassword,
    });
});
// LOGIN
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user)
        res.status(401).json({ message: "Invalid credentials" });
    res.status(200).json({ message: "Login successful" });
});
// UPDATE
app.put("/update", (req, res) => {
    const users = readUsers();
    const emailParam = req.params.email;
    const { email, firstName, lastName, address, password } = req.body;
    if (!email)
        res.status(400).json({ message: "Email is required to update" });
    const user = users.find((u) => u.email === email);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.password = password || user.password;
    writeUsers(users);
    res.status(200).json({ message: "Updated successfully" });
});
// DELETE
app.delete("/delete", (req, res) => {
    const { email } = req.body;
    if (!email)
        res.status(400).json({ message: "Email is required" });
    let users = readUsers();
    const initialLength = users.length;
    users = users.filter((u) => u.email !== email);
    if (users.length === initialLength)
        res.status(404).json({ message: "User not found" });
    writeUsers(users);
    res.status(200).json({ message: "Deleted successfully" });
});
// CATCH-ALL (not found)
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=express-api-server.js.map