import {IncomingMessage, ServerResponse} from "http";

export enum Endpoints {
    TEST = '/test'
}

export class API {
    static test(req: IncomingMessage, res: ServerResponse) {
        res.end('Test', 'utf-8');
    }
}
