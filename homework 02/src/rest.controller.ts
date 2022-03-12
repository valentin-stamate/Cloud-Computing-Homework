import {IncomingMessage, ServerResponse} from "http";
import {ActorModel, MovieModel} from "./sequelize";
import {StatusCode} from "./rest.status.codes";
import {ResponseMessage} from "./models";
import {RestEndpoints} from "./rest.enpoints";

export class RestController {
    /* GET */
    static async getMovies(req: IncomingMessage, res: ServerResponse) {
        const rows = (await MovieModel.findAll({include: [ActorModel]})).map(item => item.toJSON());
        res.end(JSON.stringify(rows));
    }

    /* GET */
    static async getActors(req: IncomingMessage, res: ServerResponse) {
        const rows = (await ActorModel.findAll({include: MovieModel})).map(item => item.toJSON());
        res.end(JSON.stringify(rows));
    }

    /* POST */
    static async addMovie(req: IncomingMessage, res: ServerResponse) {
        let body: any = {};
        req.on('data', (data) => {
           body = JSON.parse(data);
        });
        req.on('end', async () => {
            const title = body.title;

            const row = await MovieModel.findOne({
                where: {
                    title: title,
                }
            });

            if (row !== null) {
                res.statusCode = StatusCode.CONFLICT;
                res.end(JSON.stringify(new ResponseMessage(`Movie ${title} already exists`)));
                return;
            }

            await MovieModel.create(body);

            res.end(JSON.stringify(new ResponseMessage('Success')));
        });
    }

    /* POST */
    static async addActor(req: IncomingMessage, res: ServerResponse) {
        let body: any = {};

        req.on('data', (data) => {
            body = JSON.parse(data);
        });
        req.on('end', async () => {
            const name = body.name;

            const row = await ActorModel.findOne({
                where: {
                    name: name,
                }
            });


            if (row !== null) {
                res.statusCode = StatusCode.CONFLICT;
                res.end(JSON.stringify(new ResponseMessage(`Actor ${name} already exists`)));
                return;
            }

            await ActorModel.create(body);

            res.end(JSON.stringify(new ResponseMessage('Success')));
        });
    }

    /* PUT */
    static async updateMovie(req: IncomingMessage, res: ServerResponse) {
        let body: any = {};
        const route = req.url as string;
        // @ts-ignore
        const id = route.match(RestEndpoints.MOVIE_UPDATE_REGEX)[1];

        req.on('data', (data) => {
            body = JSON.parse(data);
        });
        req.on('end', async () => {
            const row = await MovieModel.findOne({
                where: {
                    id: id,
                }
            });

            if (row === null) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Movie with id ${id} not found`)));
                return;
            }

            if (body.title !== undefined) {
                const existing = await MovieModel.findOne({
                    where: {
                        title: body.title,
                    }
                })

                if (existing !== null) {
                    res.statusCode = StatusCode.CONFLICT;
                    res.end(JSON.stringify(new ResponseMessage(`Movie with title ${body.title} already exists`)));
                    return;
                }
            }

            await row.update(body);

            res.end(JSON.stringify(new ResponseMessage('Success')));
        });
    }

    /* PUT */
    static async updateActor(req: IncomingMessage, res: ServerResponse) {
        let body: any = {};
        const route = req.url as string;
        // @ts-ignore
        const id = route.match(RestEndpoints.ACTOR_UPDATE_REGEX)[1];

        req.on('data', (data) => {
            body = JSON.parse(data);
        });
        req.on('end', async () => {
            const row = await ActorModel.findOne({
                where: {
                    id: id,
                }
            });

            if (row === null) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Actor with id ${id} not found`)));
                return;
            }

            if (body.name !== undefined) {
                const existing = await ActorModel.findOne({
                    where: {
                        name: body.name,
                    }
                })

                if (existing !== null) {
                    res.statusCode = StatusCode.CONFLICT;
                    res.end(JSON.stringify(new ResponseMessage(`Actor with name ${body.name} already exists`)));
                    return;
                }
            }

            await row.update(body);

            res.end(JSON.stringify(new ResponseMessage('Success')));
        });
    }

    /* DELETE */
    static async deleteMovie(req: IncomingMessage, res: ServerResponse) {
        let body: any = {};
        const route = req.url as string;
        // @ts-ignore
        const id = route.match(RestEndpoints.MOVIE_UPDATE_REGEX)[1];

        req.on('data', (data) => {
            body = JSON.parse(data);
        });
        req.on('end', async () => {
            const row = await MovieModel.findOne({
                where: {
                    id: id,
                }
            });

            if (row === null) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Movie with id ${id} not found`)));
                return;
            }

            await row.destroy();

            res.end(JSON.stringify(row.toJSON()));
        });
    }

    /* DELETE */
    static async deleteActor(req: IncomingMessage, res: ServerResponse) {
        let body: any = {};
        const route = req.url as string;
        // @ts-ignore
        const id = route.match(RestEndpoints.ACTOR_UPDATE_REGEX)[1];

        req.on('data', (data) => {
            body = JSON.parse(data);
        });
        req.on('end', async () => {
            const row = await ActorModel.findOne({
                where: {
                    id: id,
                }
            });

            if (row === null) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Actor with id ${id} not found`)));
                return;
            }

            await row.destroy();

            res.end(JSON.stringify(row.toJSON()));
        });
    }

    /* Movie Actor */
    static async addMovieActor(req: IncomingMessage, res: ServerResponse) {
        let body: any = {};
        const route = req.url as string;
        // @ts-ignore
        const movieId = route.match(RestEndpoints.MOVIE_ACTOR_REGEX)[1];
        // @ts-ignore
        const actorId = route.match(RestEndpoints.MOVIE_ACTOR_REGEX)[2];

        req.on('data', (data) => {
            body = JSON.parse(data);
        });
        req.on('end', async () => {
            const movieRow = await MovieModel.findOne({
                where: {
                    id: movieId,
                }
            });

            const actorRow = await ActorModel.findOne({
                where: {
                    id: actorId,
                }
            });

            if (movieRow === null) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Movie with id ${movieId} not found`)));
                return;
            }

            if (actorRow === null) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Actor with id ${actorId} not found`)));
                return;
            }

            (await movieRow.getActors()).map((item: ActorModel) => {
                const json = item.toJSON();
                if ('' + json.id === actorId) {
                    res.statusCode = StatusCode.CONFLICT;
                    res.end(JSON.stringify(new ResponseMessage(`Actor with id ${actorId} already associated`)));
                    return;
                }
            });

            await movieRow.addActor(actorRow);

            res.end(JSON.stringify(new ResponseMessage('Success')));
        });
    }

    /* Movie Actor */
    static async deleteMovieActor(req: IncomingMessage, res: ServerResponse) {
        let body: any = {};
        const route = req.url as string;
        // @ts-ignore
        const movieId = route.match(RestEndpoints.MOVIE_ACTOR_REGEX)[1];
        // @ts-ignore
        const actorId = route.match(RestEndpoints.MOVIE_ACTOR_REGEX)[2];

        req.on('data', (data) => {
            body = JSON.parse(data);
        });
        req.on('end', async () => {
            const movieRow = await MovieModel.findOne({
                where: {
                    id: movieId,
                }
            });

            const actorRow = await ActorModel.findOne({
                where: {
                    id: actorId,
                }
            });

            if (movieRow === null) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Movie with id ${movieId} not found`)));
                return;
            }

            if (actorRow === null) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Actor with id ${actorId} not found`)));
                return;
            }

            let found = false;
            (await movieRow.getActors()).map((item: ActorModel) => {
                const json = item.toJSON();
                if ('' + json.id === actorId) {
                    found = true;
                    return;
                }
            });

            if (!found) {
                res.statusCode = StatusCode.NOT_FOUND;
                res.end(JSON.stringify(new ResponseMessage(`Actor with id ${actorId} not associated`)));
                return;
            }

            await movieRow.removeActor(actorRow);

            res.end(JSON.stringify(new ResponseMessage('Success')));
        });
    }

}

