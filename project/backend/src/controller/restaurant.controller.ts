import {NextFunction, Request, Response} from "express";
import {Headers, ResponseMessage, StatusCode} from "../util/rest.utils";
import {JwtService} from "../service/jwt.service";
import {FoodItem, User, Restaurant, Price} from "../database/models";
import {AppDataSource} from "../database/database";

export class RestaurantController {
    static async getRestaurantFoodItems(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const restaurant = JwtService.verifyToken(token) as Restaurant;

        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOne({
            where:{id: restaurant.id},
            relations:["foodItems"]
        });

        // const existingRestaurant = await AppDataSource.manager.createQueryBuilder(Restaurant,'restaurant')
        //                                 .select("restaurant")
        //                                 .addSelect("foodItem")
        //                                 .addSelect("price")  
        //                                 .innerJoin(FoodItem, 'foodItem', 'restaurant.id = foodItem.restaurant.id')
        //                                 .innerJoin(Price, 'price', 'foodItem.id= price.foodItem.id')
        //                                 .where('restaurant.id = :id', { id: restaurant.id })
        //                                 .getMany() 
        console.log(existingRestaurant);
        if (!existingRestaurant) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }

        const foodList = existingRestaurant.foodItems;

        if (!foodList || foodList.length === 0) {
            res.statusCode = StatusCode.OK;
            res.end(ResponseMessage.EMPTY_CART);
            return;
        }

        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify(foodList));
    }

    static async getRestaurantFoodItem(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const restaurant = JwtService.verifyToken(token) as Restaurant;
        const foodItemId = req.params.foodItemId;

        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOne({
            where:{id: restaurant.id},
            relations:["foodItems"]
        });

        if (!existingRestaurant) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }
        
        const foodItemRepository = AppDataSource.getRepository(FoodItem);
        const existingFoodItem = await foodItemRepository.findOne({
            where:{id: foodItemId},
            relations:["priceHistory"]
        });
        
        if (!existingFoodItem) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.FOOD_NOT_EXISTS);
            return;
        }

        const foodList = existingRestaurant.foodItems;

        if (!foodList || foodList.length === 0) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.EMPTY_CART);
            return;
        }


        const found = foodList.some(el => el.id == foodItemId);
        if (!found) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.FOOD_NOT_EXISTS);
            return;
        }


        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify(existingFoodItem));
    }

    static async addFoodItem(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const restaurant = JwtService.verifyToken(token) as Restaurant;
        const body = req.body;

        if (!body.name || !body.price || !body.details) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const newPrice = parseInt(body.price);
        if (isNaN(newPrice)){
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }


        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOne({
            where:{id: restaurant.id},
            relations:["foodItems"]
        });

        if (!existingRestaurant) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }
        
        const newPriceHistory = new Price();
        newPriceHistory.modifyDate = new Date();
        newPriceHistory.value = newPrice;

        const newFoodItem = new FoodItem();
        newFoodItem.name=body.name;
        newFoodItem.details=body.details;
        newFoodItem.price=newPrice;
        newFoodItem.priceHistory=[newPriceHistory];
        newFoodItem.restaurant = existingRestaurant;

        newPriceHistory.foodItem = newFoodItem;
        

        const foodList = existingRestaurant.foodItems;

    
        if (!foodList || foodList.length === 0) {
            existingRestaurant.foodItems=[newFoodItem];
        }else{
            existingRestaurant.foodItems?.push(newFoodItem);
        }
        await AppDataSource.manager.save(existingRestaurant);
        await AppDataSource.manager.save(newFoodItem);
        await AppDataSource.manager.save(newPriceHistory);
        res.statusCode = StatusCode.CREATED;
        res.end();
    }


    static async updateFoodItem(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const restaurant = JwtService.verifyToken(token) as Restaurant;
        const foodItemId = req.params.foodItemId;
        const body = req.body;

        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOne({
            where:{id: restaurant.id},
            relations:["foodItems"]
        });

        if (!existingRestaurant) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }
        
        const foodItemRepository = AppDataSource.getRepository(FoodItem);
        const existingFoodItem = await foodItemRepository.findOne({
            where:{id: foodItemId},
            relations:["priceHistory"]
        });
        
        if (!existingFoodItem) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.FOOD_NOT_EXISTS);
            return;
        }

        const foodList = existingRestaurant.foodItems;

        if (!foodList || foodList.length === 0) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.EMPTY_CART);
            return;
        }


        const found = foodList.some(el => el.id == foodItemId);
        if (!found) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.FOOD_NOT_EXISTS);
            return;
        }


        if (body.name) {
            existingFoodItem.name = body.name;
        }

        if (body.details){
            existingFoodItem.details = body.details;
        }

        if (body.price){
            const newPrice = parseInt(body.price);
            if (isNaN(newPrice)){
                res.statusCode = StatusCode.BAD_REQUEST;
                res.end(ResponseMessage.INVALID_FORM);
                return;
            }

            const newPriceHistory = new Price();
            newPriceHistory.modifyDate = new Date();
            newPriceHistory.value = newPrice;
            existingFoodItem.priceHistory?.push(newPriceHistory);
            await AppDataSource.manager.save(newPriceHistory);
        }

        await AppDataSource.manager.save(existingFoodItem);
        
        res.statusCode = StatusCode.OK;
        res.end();
    }

    static async deleteFoodItem(req: Request<any>, res: Response, next: NextFunction) {
        const token = req.get(Headers.AUTHORIZATION) as string;
        const restaurant = JwtService.verifyToken(token) as Restaurant;
        const foodItemId = req.params.foodItemId;
        const body = req.body;

        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOne({
            where:{id: restaurant.id},
            relations:["foodItems"]
        });

        if (!existingRestaurant) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }
        
        const foodItemRepository = AppDataSource.getRepository(FoodItem);
        const existingFoodItem = await foodItemRepository.findOne({
            where:{id: foodItemId},
            relations:["priceHistory"]
        });
        
        if (!existingFoodItem) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.FOOD_NOT_EXISTS);
            return;
        }

        const foodList = existingRestaurant.foodItems;

        if (!foodList || foodList.length === 0) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.EMPTY_CART);
            return;
        }


        const found = foodList.some(el => el.id == foodItemId);
        if (!found) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.FOOD_NOT_EXISTS);
            return;
        }
        
        existingRestaurant.foodItems = existingRestaurant.foodItems?.filter(foodItem => {
            return foodItem.id != body.foodId
        });
        await AppDataSource.manager.save(existingRestaurant);
        await AppDataSource.createQueryBuilder()
                            .delete()
                            .from(FoodItem)
                            .where("id = :id", { id: existingFoodItem.id })
                            .execute();

        res.statusCode = StatusCode.OK;
        res.end();
    }
}