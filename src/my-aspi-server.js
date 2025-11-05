import http from "http";
import fs from "fs";
import { parse } from "url";
const PORT = 3000;
const USERS_FILE = './users.json';
function readUsers() {
    if (!fs.existsSync(USERS_FILE))
        return [];
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
}
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
function send(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
function parseBody(req, callback) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            callback(JSON.parse(body));
        }
        catch {
            callback({});
        }
    });
}
const server = http.createServer((req, res) => {
    const { pathname } = parse(req.url ?? '/', true);
    //  ===== REGISTER ====== 
    if (req.method === 'POST' && pathname === '/register') {
        parseBody(req, (body) => {
            const { firstName, lastName, phone, email, address, password } = body;
            // Validate required fields
            if (!firstName || !lastName || !phone || !email || !address || !password) {
                return send(res, 400, { message: 'All fields are required' });
            }
            const users = readUsers();
            // Check if email is already taken
            if (users.find((u) => u.email === email)) {
                return send(res, 409, { message: 'Email already registered' });
            }
            // Save new user
            const newUser = { firstName, lastName, phone, email, address, password };
            users.push(newUser);
            writeUsers(users);
            // Return new user info (excluding password)
            const userToReturn = { ...newUser };
            delete userToReturn.password;
            return send(res, 201, {
                message: 'Registered successfully',
                user: userToReturn
            });
        });
        // ===== LOGIN =====
    }
    else if (req.method === 'POST' && pathname === '/login') {
        parseBody(req, body => {
            const { email, password } = body;
            const users = readUsers();
            const user = users.find((u) => u.email === email && u.password === password);
            if (!user)
                return send(res, 401, { message: 'Invalid credentials' });
            send(res, 200, { message: 'Login successful' });
        });
        // ===== UPDATE =====
    }
    else if (req.method === 'PUT' && pathname === '/update') {
        parseBody(req, body => {
            const { email, firstName, lastName, address, password } = body;
            if (!email)
                return send(res, 400, { message: 'Email is required to update' });
            const users = readUsers();
            const user = users.find((u) => u.email === email);
            if (!user)
                return send(res, 404, { message: 'User not found' });
            if (firstName)
                user.firstName = firstName;
            if (lastName)
                user.lastName = lastName;
            if (address)
                user.address = address;
            if (password)
                user.password = password;
            writeUsers(users);
            send(res, 200, { message: 'Updated successfully' });
        });
        // ===== DELETE =====
    }
    else if (req.method === 'DELETE' && pathname === '/delete') {
        parseBody(req, body => {
            const { email } = body;
            if (!email)
                return send(res, 400, { message: 'Email is required' });
            let users = readUsers();
            const initialLength = users.length;
            users = users.filter((u) => u.email !== email);
            if (users.length === initialLength)
                return send(res, 404, { message: 'User not found' });
            writeUsers(users);
            send(res, 200, { message: 'Deleted successfully' });
        });
        // ===== NOT FOUND =====
    }
    else {
        send(res, 404, { message: 'Route not found' });
    }
});
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=my-aspi-server.js.map