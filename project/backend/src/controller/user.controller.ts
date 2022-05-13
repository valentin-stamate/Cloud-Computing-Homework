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
        const existingUser = await userRepository.findOneBy({
            id: user.id,
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

        for (let foodItem of foodList) {
            const email = foodItem.restaurant.email;
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
                    from: EmailDefaults.FROM,
                    to: email,
                    html: emailHtml,
                });

                /* If successful, remove the items from cart, else the flow enters into catch statement and nothing happens */
                successfulFood.push(...foodList);

                existingUser.money -= partialPrice;
                successfulPrice += partialPrice;

                UtilService.removeArrayFromOtherArray(user.foodItems, foodList);
                await AppDataSource.manager.save(existingUser);
            } catch (err) {
                console.log(err);
            }
        }

        /* After this, an email is sent to the user with the order */
        try {
            const userOrderHtmlEmail = UserOrderMail.getHtml(existingUser.address, successfulPrice, successfulFood);

            await MailService.sendMail({
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

}