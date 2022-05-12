import express from 'express';
import {connectDatabase} from "./database/database";
import {Middleware} from "./controller/middlewares";
import fileUpload from "express-fileupload";
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {Endpoints} from "./endpoints";
import {AuthController} from "./controller/auth.controller";
require('dotenv').config();

const env = process.env;

const app = express();
const port = env.PORT;
const host = `http://localhost:${port}`;

connectDatabase();

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/

app.set('json spaces', 4);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Handle logs in console during development
app.use(morgan('dev'));
if (process.env.NODE_ENV === 'development') {
    app.use(cors({origin: ['*']}));
}

// Handle security and origin in production
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

/************************************************************************************
 *                               Register all REST routes
 ***********************************************************************************/
app.use(fileUpload());

app.post(Endpoints.USER_LOGIN, Middleware.visitorMiddleware, AuthController.userLogin);
app.post(Endpoints.USER_LOGIN_CODE, Middleware.visitorMiddleware, AuthController.userLoginWithCode);
app.post(Endpoints.USER_SIGNUP, Middleware.visitorMiddleware, AuthController.userSignup);

app.post(Endpoints.RESTAURANT_LOGIN, Middleware.visitorMiddleware, AuthController.restaurantLogin);
app.post(Endpoints.RESTAURANT_LOGIN_CODE, Middleware.visitorMiddleware, AuthController.restaurantLoginWithCode);
app.post(Endpoints.RESTAURANT_SIGNUP, Middleware.visitorMiddleware, AuthController.restaurantSignup);

/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/
app.use(Middleware.errorHandler);

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});