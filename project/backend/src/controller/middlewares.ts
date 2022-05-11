import {NextFunction, Request, Response,} from "express";
import {JwtService} from "../service/jwt.service";
import {ContentType, ResponseMessage, StatusCode} from "../util/rest.utils";
import {Restaurant, User} from "../database/models";

export class Middleware {
    /** Middleware for unauthorized users. In this case every request can pass. */
    static async visitorMiddleware (req: Request<any>, res: Response, next: NextFunction) {
        res.setHeader('Content-Type', ContentType.JSON);
        next();
    }

    /** Middleware for authorized students. In order for the request to pass the user should exist. */
    static async userMiddleware (req: Request<any>, res: Response, next: NextFunction) {
        try {
            const token = req.get('Authorization');

            if (!token) {
                next(new ResponseError(ResponseMessage.NO_AUTH_TOKEN, StatusCode.UNAUTHORIZED));
                return;
            }

            const user = JwtService.verifyToken(token) as User;

            if (user === null) {
                next(new ResponseError(ResponseMessage.INVALID_TOKEN, StatusCode.IM_A_TEAPOT));
                return;
            }

            /* TODO */
            const row = null;

            if (row === null) {
                next(new ResponseError(ResponseMessage.USER_NOT_EXISTS, StatusCode.IM_A_TEAPOT));
                return;
            }

            res.setHeader('Content-Type', ContentType.JSON);
            next();
        } catch (err) {
            console.log(err);
        }
    }

    /** Middleware for coordinators users. */
    static async restaurantMiddleware (req: Request<any>, res: Response, next: NextFunction) {
        try {
            const token = req.get('Authorization');

            if (!token) {
                next(new ResponseError(ResponseMessage.NO_AUTH_TOKEN, StatusCode.UNAUTHORIZED));
                return;
            }

            const user = JwtService.verifyToken(token) as Restaurant;

            if (user === null) {
                next(new ResponseError(ResponseMessage.INVALID_TOKEN, StatusCode.IM_A_TEAPOT));
                return;
            }

            /* TODO */
            const row = null;

            if (row === null) {
                next(new ResponseError(ResponseMessage.USER_NOT_EXISTS, StatusCode.IM_A_TEAPOT));
                return;
            }

            res.setHeader('Content-Type', ContentType.JSON);
            next();
        } catch (err) {
            console.log(err);
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