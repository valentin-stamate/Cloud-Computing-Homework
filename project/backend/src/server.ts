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
import {VisitorController} from "./controller/visitor.controller";
require('dotenv').config();

const env = process.env;

const app = express();
const port = env.PORT;
const host = `http://localhost:${port}`;

connectDatabase(true).catch(err => {
    console.log(err);
});

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/

app.set('json spaces', 4);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Handle logs in console during development
app.use(morgan('dev'));
app.use(cors({origin: '*'}));
// if (process.env.NODE_ENV === 'development') {
// }

// Handle security and origin in production
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

/************************************************************************************
 *                               Register all REST routes
 ***********************************************************************************/
app.use(fileUpload());

app.get(Endpoints.LAST_FOOD, Middleware.visitorMiddleware, VisitorController.getLastFood);
app.get(Endpoints.LAST_RESTAURANTS, Middleware.visitorMiddleware, VisitorController.getLastRestaurants);
app.get(`${Endpoints.RESTAURANT}/:restaurantId`, Middleware.visitorMiddleware, VisitorController.getRestaurant);
app.get(`${Endpoints.FOOD}/:foodItemId`, Middleware.visitorMiddleware, VisitorController.getFoodItem);
app.post(Endpoints.SEARCH, Middleware.visitorMiddleware, VisitorController.searchFood);


app.post(Endpoints.USER_LOGIN, Middleware.visitorMiddleware, AuthController.userLogin);
app.post(Endpoints.USER_LOGIN_CODE, Middleware.visitorMiddleware, AuthController.userLoginWithCode);
app.post(Endpoints.USER_SIGNUP, Middleware.visitorMiddleware, AuthController.userSignup);
app.patch(Endpoints.USER_PROFILE, Middleware.userMiddleware, UserController.updateUserProfile);
app.get(Endpoints.USER_PROFILE, Middleware.userMiddleware, UserController.getUserProfile);

app.post(Endpoints.RESTAURANT_LOGIN, Middleware.visitorMiddleware, AuthController.restaurantLogin);
app.post(Endpoints.RESTAURANT_LOGIN_CODE, Middleware.visitorMiddleware, AuthController.restaurantLoginWithCode);
app.post(Endpoints.RESTAURANT_SIGNUP, Middleware.visitorMiddleware, AuthController.restaurantSignup);

app.post(Endpoints.ORDER, Middleware.userMiddleware, UserController.makeOrder);

app.get(Endpoints.USER_CART, Middleware.userMiddleware, UserController.getUserCart);
app.post(Endpoints.USER_CART, Middleware.userMiddleware, UserController.addFoodItemUserCart);
app.delete(`${Endpoints.USER_CART}/:id`, Middleware.userMiddleware, UserController.deleteFoodItemUserCart);

app.post(Endpoints.RESTAURANT_FOOD_ITEM, Middleware.restaurantMiddleware, RestaurantController.addFoodItem);
app.get(Endpoints.RESTAURANT_FOOD_ITEM, Middleware.restaurantMiddleware, RestaurantController.getRestaurantFoodItems);
app.get(`${Endpoints.RESTAURANT_FOOD_ITEM}/:foodItemId`, Middleware.restaurantMiddleware, RestaurantController.getRestaurantFoodItem);
app.patch(`${Endpoints.RESTAURANT_FOOD_ITEM}/:foodItemId`, Middleware.restaurantMiddleware, RestaurantController.updateFoodItem);
app.delete(`${Endpoints.RESTAURANT_FOOD_ITEM}/:foodItemId`, Middleware.restaurantMiddleware, RestaurantController.deleteFoodItem);

/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/
app.use(Middleware.errorHandler);

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});