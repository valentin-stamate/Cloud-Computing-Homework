const url = 'http://localhost:8080'

export class RestEndpoints {
    static TEST = `${url}/api/test`;
}

export enum RestVerbs {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}
