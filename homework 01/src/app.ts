import http from "http";
import fs from "fs";
import path from "path";
import {API, Endpoints} from "./api";

const PORT = 8080;

http.createServer(function (request, response) {
    console.log('request ', request.url);
    const url = request.url;

    let filePath = '.' + request.url;
    if (filePath == './' || filePath == './home') {
        filePath = './index.html';
    }

    /* API */
    if (url === Endpoints.TEST) {
        API.test(request, response);
        return;
    }

    /* END API */

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(path.join('frontend', filePath), function(error, content) {
        if (error) {
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end('Page not found', 'utf-8');
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(PORT);

console.log('Server running at http://localhost:8080/');