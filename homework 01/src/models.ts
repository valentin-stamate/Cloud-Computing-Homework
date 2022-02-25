import {IncomingMessage, ServerResponse} from "http";

class ShortRequest {
    url: string;
    method: string;
    headers: string[];
    date: Date;

    constructor(req: IncomingMessage) {
        this.url = req.url;
        this.method = req.method;
        this.headers = req.rawHeaders;
        this.date = new Date();
    }
}

class ShortResponse {
    statusCode: number;
    statusMessage: string;
    date: Date;

    constructor(res: ServerResponse) {
        this.statusCode = res.statusCode;
        this.statusMessage = res.statusMessage;
        this.date = new Date();
    }
}

export class APILog {
    request: ShortRequest;
    response: ShortResponse;
    latency: number;

    constructor(req: IncomingMessage, res: ServerResponse, latency: number) {
        this.request = new ShortRequest(req);
        this.response = new ShortResponse(res);
        this.latency = latency;
    }
}

export class APIResponse {
    constructor(public firstData: any, public secondData: any, public thirdData: any) {}
}

export class FirstAPIPayload {
    ip: string;
    city: string;
    country: string;
    continent: string;

    constructor(payload: any) {
        this.city = payload.location.city;
        this.ip = payload.connection.ip;
        this.continent = payload.location.continent.name;
        this.country = payload.location.country.name;
    }
}

export class SecondAPIPayload {
    number: number;

    constructor(payload: any) {
        this.number = payload[0];
    }
}

export class ThirdAPIPayload {
    title: string;
    thumbnail: string;
    url: string;
    subredditSub: number;

    constructor(payload: any) {
        this.title = payload.data.title;
        this.thumbnail = payload.data.thumbnail;
        this.url = payload.data.url_overridden_by_dest;
        this.subredditSub = payload.data.subreddit_subscribers;
    }
}