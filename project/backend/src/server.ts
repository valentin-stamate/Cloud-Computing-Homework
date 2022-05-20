import express from 'express';
import {connectDatabase} from "./database/database";
import {Middleware} from "./controller/middlewares";
import fileUpload from "express-fileupload";
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {Endpoints} from "./endpoints";
import {AuthController} from "./controller/auth.controller";
import {UserController} from "./controller/user.controller";
import {RestaurantController} from "./controller/restaurant.controller";
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

app.post(Endpoints.ORDER, Middleware.userMiddleware, UserController.makeOrder);

app.get(Endpoints.USER_CART, Middleware.userMiddleware, UserController.getUserCart);
app.post(Endpoints.USER_CART, Middleware.userMiddleware, UserController.addFoodItemUserCart);
app.delete(Endpoints.USER_CART, Middleware.userMiddleware, UserController.deleteFoodItemUserCart);

app.post(Endpoints.RESSTAURANT_FOOD_ITEM, Middleware.visitorMiddleware, RestaurantController.addFoodItem);
app.get(Endpoints.RESSTAURANT_FOOD_ITEM, Middleware.visitorMiddleware, RestaurantController.getRestaurantFoodItems);
app.get(`${Endpoints.RESSTAURANT_FOOD_ITEM}/:foodItemId`, Middleware.visitorMiddleware, RestaurantController.getRestaurantFoodItem);
app.patch(`${Endpoints.RESSTAURANT_FOOD_ITEM}/:foodItemId`, Middleware.visitorMiddleware, RestaurantController.updateFoodItem);
app.delete(`${Endpoints.RESSTAURANT_FOOD_ITEM}/:foodItemId`, Middleware.visitorMiddleware, RestaurantController.deleteFoodItem);

/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/
app.use(Middleware.errorHandler);

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});