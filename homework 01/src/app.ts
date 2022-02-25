import http from "http";
import fs from "fs";
import path from "path";
import {API, Endpoints} from "./api";
import {APILog} from "./models";
import {serverLog} from "./log";

const PORT = 8080;

http.createServer(async function (request, response) {
    console.log(`request ${request.url} ${new Date()}`);

    const url = request.url;
    const currentPath = new URL(`http://localhost${url}`).pathname;


    let filePath = '.' + currentPath;
    if (filePath == './' || filePath == './home') {
        filePath = './index.html';
    }

    const startTime = new Date().getTime();

    /* API */
    if (currentPath === Endpoints.DATA) {
        await API.data(request, response);

        const endTime = new Date().getTime();
        const latency = endTime - startTime;

        serverLog.add(new APILog(request, response, latency));
        return;
    }

    if (currentPath === Endpoints.LOGS) {
        await API.metrics(request, response);

        const endTime = new Date().getTime();
        const latency = endTime - startTime;

        serverLog.add(new APILog(request, response, latency));
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

    const endTime = new Date().getTime();
    const latency = endTime - startTime;

    serverLog.add(new APILog(request, response, latency));

}).listen(PORT);

console.log('Server running at http://localhost:8080/');