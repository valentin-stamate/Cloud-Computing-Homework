import {NextFunction, Request, Response,} from "express";
import {JwtService} from "../service/jwt.service";
import {ContentType, Headers, ResponseMessage, StatusCode} from "../util/rest.utils";
import {Restaurant, User} from "../database/models";
import {AppDataSource} from "../database/database";

export class Middleware {
    /** Middleware for unauthorized users. In this case every request can pass. */
    static async visitorMiddleware (req: Request<any>, res: Response, next: NextFunction) {
        try {
            res.setHeader('Content-Type', ContentType.JSON);
            next();
        } catch (err) {
            console.log(err);

            res.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
            res.end();
        }
    }

    /** Middleware for authorized students. In order for the request to pass the user should exist. */
    static async userMiddleware (req: Request<any>, res: Response, next: NextFunction) {
        try {
            const token = req.get(Headers.AUTHORIZATION);

            if (!token) {
                next(new ResponseError(ResponseMessage.NO_AUTH_TOKEN, StatusCode.UNAUTHORIZED));
                return;
            }

            const user = JwtService.verifyToken(token) as User;

            if (!user) {
                next(new ResponseError(ResponseMessage.INVALID_TOKEN, StatusCode.IM_A_TEAPOT));
                return;
            }

            const userRepository = AppDataSource.getRepository(User);

            const existingUser = await userRepository.findOneBy({
                id: user.id,
                email: user.email,
                name: user.name,
            });

            if (!existingUser) {
                next(new ResponseError(ResponseMessage.USER_NOT_EXISTS, StatusCode.IM_A_TEAPOT));
                return;
            }

            res.setHeader('Content-Type', ContentType.JSON);
            next();
        } catch (err) {
            console.log(err);

            res.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
            res.end();
        }
    }

    /** Middleware for coordinators users. */
    static async restaurantMiddleware (req: Request<any>, res: Response, next: NextFunction) {
        try {
            const token = req.get(Headers.AUTHORIZATION);

            if (!token) {
                next(new ResponseError(ResponseMessage.NO_AUTH_TOKEN, StatusCode.UNAUTHORIZED));
                return;
            }

            const restaurant = JwtService.verifyToken(token) as Restaurant;

            if (restaurant === null) {
                next(new ResponseError(ResponseMessage.INVALID_TOKEN, StatusCode.IM_A_TEAPOT));
                return;
            }

            const restaurantRepository = AppDataSource.getRepository(Restaurant);
            const existingRestaurant = await restaurantRepository.findOneBy({
                id: restaurant.id,
            })

            if (!existingRestaurant) {
                next(new ResponseError(ResponseMessage.USER_NOT_EXISTS, StatusCode.IM_A_TEAPOT));
                return;
            }

            res.setHeader('Content-Type', ContentType.JSON);
            next();
        } catch (err) {
            console.log(err);

            res.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
            res.end();
        }
    }

    /** The middleware that handles all the exceptions thrown by the app */
    static errorHandler(err: ResponseError, req: Request<any>, res: Response, next: NextFunction) {
        let statusError = 500;

        if (err.status !== undefined) {
            statusError = err.status;
        }

        console.log(err);
        res.setHeader('Content-Type', ContentType.TEXT);
        res.status(statusError).send(err.message);
    }
}

export class ResponseError extends Error {
    constructor(public message: string, public status: number = 500) {
        super(message);
    }
}