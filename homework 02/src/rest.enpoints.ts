const url = 'http://localhost:8080'

export class RestEndpoints {
    static MOVIE = `/api/movie`;
    static ACTOR = `/api/actor`;

    static MOVIE_UPDATE_REGEX = new RegExp(/^\/api\/movie\/(\d+)$/);
    static ACTOR_UPDATE_REGEX = new RegExp(/^\/api\/actor\/(\d+)$/);
    static MOVIE_ACTOR_REGEX = new RegExp(/^\/api\/movie\/(\d+)\/actor\/(\d+)$/)
}

export enum RestVerbs {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}
