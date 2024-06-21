const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8500;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
};

const validUser = {
    email: "user@gmail.com",
    password: "87654321"
};

http.createServer((req, res) => {
    console.log(`Request for ${req.url}`);

    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const email = params.get('email');
            const password = params.get('password');

            if (email === validUser.email && password === validUser.password) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<h1>Successfully Logged In</h1><p>Welcome to the protected page!</p>');
            } else {
                res.writeHead(401, { 'Content-Type': 'text/html' });
                res.end('<h1>Invalid username or password.</h1>');
            }
        });
    } else {
        let filePath = req.url === '/' ? 'index.html' : '.' + req.url;
        let extname = path.extname(filePath).toLowerCase();
        let contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1>');
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${error.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
