// server.js
import http from 'http';
const url = require('url');
let users = []; // In-memory "database"
function parseJSONBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        }
        catch (err) {
            callback(err);
        }
    });
}
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    // GET /users - list all users
    if (req.method === 'GET' && pathname === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(users));
    }
    // POST /users - add a new user
    if (req.method === 'POST' && pathname === '/users') {
        return parseJSONBody(req, (err, data) => {
            if (err || !data.name || !data.age) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid user data' }));
            }
            const newUser = { id: users.length + 1, ...data };
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(newUser));
        });
    }
    // GET /users/:id - get user by id
    if (req.method === 'GET' && pathname.startsWith('/users/')) {
        const id = parseInt(pathname.split('/')[2]);
        const user = users.find(u => u.id === id);
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'User not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(user));
    }
    // PUT /users/:id - update user by id
    if (req.method === 'PUT' && pathname.startsWith('/users/')) {
        const id = parseInt(pathname.split('/')[2]);
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'User not found' }));
        }
        return parseJSONBody(req, (err, data) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid data' }));
            }
            users[userIndex] = { ...users[userIndex], ...data };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(users[userIndex]));
        });
    }
    // DELETE /users/:id - delete user by id
    if (req.method === 'DELETE' && pathname.startsWith('/users/')) {
        const id = parseInt(pathname.split('/')[2]);
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'User not found' }));
        }
        const deletedUser = users.splice(userIndex, 1)[0];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(deletedUser));
    }
    // Unknown route
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
//# sourceMappingURL=com-api-server.js.map