import {IncomingMessage, ServerResponse} from "http";

export class RestController {
    static async test(req: IncomingMessage, res: ServerResponse) {

        res.end('Ana are mere');
    }
}

