import http from "http";
import {RestEndpoints, RestVerbs} from "./rest.enpoints";
import {RestController} from "./rest.controller";

const PORT = 8080;
const host = `http://localhost:${PORT}`;

http.createServer(async function (request, response) {
    const route = `${host}${request.url}`;
    const verb = request.method;

    /* API */
    if (route === RestEndpoints.TEST && verb === RestVerbs.GET) {
        await RestController.test(request, response);
        return;
    }

    response.end("Not found");

}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);