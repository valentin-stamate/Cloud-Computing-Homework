import {IncomingMessage, ServerResponse} from "http";
import axios from "axios";
import {APIResponse, FirstAPIPayload, SecondAPIPayload, ThirdAPIPayload} from "./models";
import * as url from "url";
import {config} from "dotenv";
import {serverLog} from "./log";

config();

export enum Endpoints {
    DATA = '/data',
    LOGS = '/metrics',
}

export class API {
    static async data(req: IncomingMessage, res: ServerResponse) {
        const queryParams = url.parse(req.url, true).query;
        const key = queryParams.key as string;

        if (!this.keyIsValid(key)) {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized', 'utf-8');
            return;
        }

        const ipKey = process.env.IPSKEY;
        const firstAPIResponse = await axios.get(`https://api.ip2loc.com/${ipKey}/detect`);
        const secondAPIResponse = await axios.get('http://www.randomnumberapi.com/api/v1.0/random?min=1&max=20');

        const firstPayload = new FirstAPIPayload(firstAPIResponse.data);
        const secondPayload = new SecondAPIPayload(secondAPIResponse.data);

        const thirdAPIResponse = await axios.get(`http://www.reddit.com/search.json?q=${firstPayload.city}&limit=${secondPayload.number}&sort=top`);
        const thirdPayload = thirdAPIResponse.data.data.children.map(item => new ThirdAPIPayload(item));


        const payload = new APIResponse(firstPayload, secondPayload, thirdPayload)

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(payload), 'utf-8');
    }

    static metrics(req: IncomingMessage, res: ServerResponse) {
        const queryParams = url.parse(req.url, true).query;
        const key = queryParams.key as string;

        if (!this.keyIsValid(key)) {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized', 'utf-8');
            return;
        }

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(serverLog.get()), 'utf-8');
    }

    static keyIsValid(key: string) {
        if (key === undefined) {
            return false;
        }

        return process.env.KEY === key;
    }
}
