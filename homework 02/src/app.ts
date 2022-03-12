import http from "http";
import {RestEndpoints, RestVerbs} from "./rest.enpoints";
import {RestController} from "./rest.controller";
import {initDatabase} from "./sequelize";

initDatabase();

const PORT = 8080;
const host = `http://localhost:${PORT}`;

http.createServer(async function (request, response) {
    const route = request.url as string;
    const verb = request.method;

    /** --------=========== API ===========-------- */
    /* Movie */
    response.setHeader('Content-Type', 'application/json');
    if (route === RestEndpoints.MOVIE && verb === RestVerbs.GET) {
        await RestController.getMovies(request, response);
        return;
    }

    if (route === RestEndpoints.MOVIE && verb === RestVerbs.POST) {
        await RestController.addMovie(request, response);
        return;
    }

    if (route.match(RestEndpoints.MOVIE_UPDATE_REGEX) && verb === RestVerbs.PUT) {
        await RestController.updateMovie(request, response);
        return;
    }

    if (route.match(RestEndpoints.MOVIE_UPDATE_REGEX) && verb === RestVerbs.DELETE) {
        await RestController.deleteMovie(request, response);
        return;
    }

    if (route.match(RestEndpoints.MOVIE_ACTOR_REGEX) && verb === RestVerbs.PUT) {
        await RestController.addMovieActor(request, response);
        return;
    }

    if (route.match(RestEndpoints.MOVIE_ACTOR_REGEX) && verb === RestVerbs.DELETE) {
        await RestController.deleteMovieActor(request, response);
        return;
    }

    /* Actor */
    if (route === RestEndpoints.ACTOR && verb === RestVerbs.GET) {
        await RestController.getActors(request, response);
        return;
    }

    if (route === RestEndpoints.ACTOR && verb === RestVerbs.POST) {
        await RestController.addActor(request, response);
        return;
    }

    if (route.match(RestEndpoints.ACTOR_UPDATE_REGEX) && verb === RestVerbs.PUT) {
        await RestController.updateActor(request, response);
        return;
    }

    if (route.match(RestEndpoints.ACTOR_UPDATE_REGEX) && verb === RestVerbs.DELETE) {
        await RestController.deleteActor(request, response);
        return;
    }

    response.end("Not found");

}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);