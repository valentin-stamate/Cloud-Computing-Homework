import {NextFunction, Request, Response} from "express";
import {Headers, ResponseMessage, StatusCode} from "../util/rest.utils";
import {JwtService} from "../service/jwt.service";
import {FoodItem, User} from "../database/models";
import {AppDataSource} from "../database/database";
import {EmailDefaults, MailService, RestaurantOrderMail, UserOrderMail} from "../service/mail.service";
import {UtilService} from "../service/util.service";

export class UserController {

    static async makeOrder(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const user = JwtService.verifyToken(token) as User;

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where: {id: user.id,},
            relations:["foodItems"],
        });

        if (!existingUser) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.USER_NOT_EXISTS);
            return;
        }

        const foodList = existingUser.foodItems;

        if (!foodList || foodList.length === 0) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.EMPTY_CART);
            return;
        }

        const separateFoodByEmail = new Map<string, FoodItem[]>();
        let totalPrice = 0;

        const foodRepository = AppDataSource.getRepository(FoodItem);

        for (let foodItem of foodList) {
            const existingFoodItem = await foodRepository.findOne({
                where: {id: foodItem.id},
                relations:["restaurant"],
            });

            if (!existingFoodItem) {
                console.log('Something went wrong');
                continue;
            }

            const email = existingFoodItem.restaurant.email;
            totalPrice += foodItem.price;

            const restaurantFoodListOrder = separateFoodByEmail.get(email);
            if (!restaurantFoodListOrder) {
                separateFoodByEmail.set(email, [foodItem]);
                continue;
            }

            restaurantFoodListOrder.push(foodItem);
        }

        if (totalPrice > existingUser.money) {
            res.statusCode = StatusCode.NOT_ACCEPTABLE;
            res.end(ResponseMessage.NOT_ENOUGH_FOUNDS);
            return;
        }

        let successfulFood: FoodItem[] = [];
        let successfulPrice = 0;

        for (let [email, foodList] of separateFoodByEmail.entries()) {
            const partialPrice = foodList.reduce((pre, curr) => pre + curr.price, 0);

            try {
                const emailHtml = RestaurantOrderMail.getHtml(existingUser.address, partialPrice, foodList);

                await MailService.sendMail({
                    subject: "[Order] FastFood",
                    from: EmailDefaults.FROM,
                    to: email,
                    html: emailHtml,
                });

                /* If successful, remove the items from cart, else the flow enters into catch statement and nothing happens */
                successfulFood.push(...foodList);

                existingUser.money -= partialPrice;
                successfulPrice += partialPrice;

                // UtilService.removeArrayFromOtherArray(user.foodItems, foodList);
                existingUser.foodItems = [];
                await AppDataSource.manager.save(existingUser);
            } catch (err) {
                console.log(err);
            }
        }

        /* After this, an email is sent to the user with the order */
        try {
            const userOrderHtmlEmail = UserOrderMail.getHtml(existingUser.address, successfulPrice, successfulFood);

            await MailService.sendMail({
                subject: "[Order] FastFood",
                from: EmailDefaults.FROM,
                to: existingUser.email,
                html: userOrderHtmlEmail,
            });
        } catch (err) {
            console.log(err);
        }

        res.statusCode = StatusCode.OK;
        res.end();
    }

    static async getUserCart(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const user = JwtService.verifyToken(token) as User;

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where:{id: user.id},
            relations:["foodItems"]
        });

        if (!existingUser) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.USER_NOT_EXISTS);
            return;
        }

        const foodList = existingUser.foodItems;

        if (!foodList || foodList.length === 0) {
            res.statusCode = StatusCode.OK;
            res.end(JSON.stringify([]));
            return;
        }

        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify(foodList));
    }

    static async addFoodItemUserCart(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const user = JwtService.verifyToken(token) as User;
        const body = req.body;

        if (!body.foodId) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }


        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where:{id: user.id},
            relations:["foodItems"]
        });

        if (!existingUser) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.USER_NOT_EXISTS);
            return;
        }

        const foodItemRepository = AppDataSource.getRepository(FoodItem);
        const existingFoodItem = await foodItemRepository.findOneBy({
            id: body.foodId,
        });

        if (!existingFoodItem) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.FOOD_NOT_EXISTS);
            return;
        }

        const foodList = existingUser.foodItems;

    
        if (!foodList || foodList.length === 0) {
            existingUser.foodItems=[existingFoodItem];
        }else{
            existingUser.foodItems?.push(existingFoodItem);
        }
        await AppDataSource.manager.save(existingUser);
        res.statusCode = StatusCode.CREATED;
        res.end();
    }

    static async deleteFoodItemUserCart(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const user = JwtService.verifyToken(token) as User;
        const foodItemId = req.params.id;

        if (!foodItemId) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where:{id: user.id},
            relations:["foodItems"]
        });

        if (!existingUser) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.USER_NOT_EXISTS);
            return;
        }

        const foodItemRepository = AppDataSource.getRepository(FoodItem);
        const existingFoodItem = await foodItemRepository.findOneBy({
            id: foodItemId,
        });

        if (!existingFoodItem) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.FOOD_NOT_EXISTS);
            return;
        }
        
        existingUser.foodItems = existingUser.foodItems?.filter(foodItem => {
            return foodItem.id != parseInt(foodItemId);
        });
        await AppDataSource.manager.save(existingUser);


        res.statusCode = StatusCode.OK;
        res.end();
    }

    static async updateUserProfile(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        console.log(token);
        const user = JwtService.verifyToken(token) as User;
        const body = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where:{id: user.id}
        });

        if (!existingUser) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }


        if (body.name) {
            existingUser.name = body.name;
        }

        if (body.email){
            existingUser.email = body.email;
        }
        if (body.address){
            existingUser.address = body.address;
        }
        await AppDataSource.manager.save(existingUser);
        
        res.statusCode = StatusCode.OK;
        res.end();
    }

    static async getUserProfile(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const user = JwtService.verifyToken(token) as User;

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where:{id: user.id}
        });

        if (!existingUser) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }


        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify(existingUser));
    }
}