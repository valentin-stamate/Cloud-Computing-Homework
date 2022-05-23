import {NextFunction, Request, Response} from "express";
import {FoodItem, Restaurant} from "../database/models";
import {ContentType, ResponseMessage, StatusCode} from "../util/rest.utils";
import {AppDataSource} from "../database/database";
import {ResponseError} from "./middlewares";

export class VisitorController {

    static async getLastFood(req: Request<any>, res: Response, next: NextFunction) {
        const foodRepository = AppDataSource.getRepository(FoodItem);
        const foodItems = await foodRepository.find();

        foodItems.sort((itemA, itemB) => - (itemA.id - itemB.id));

        res.contentType(ContentType.JSON);
        res.end(JSON.stringify(foodItems));
    }

    static async getLastRestaurants(req: Request<any>, res: Response, next: NextFunction) {
        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const restaurants = await restaurantRepository.find();

        restaurants.sort((itemA, itemB) => - (itemA.id - itemB.id));

        res.contentType(ContentType.JSON);
        res.end(JSON.stringify(restaurants));
    }

    static async getRestaurant(req: Request<any>, res: Response, next: NextFunction) {
        const restaurantId = req.params.restaurantId;

        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOne({
            where: {
                id: restaurantId,
            },
            relations: ['foodItems'],
        });

        if (!existingRestaurant) {
            next(new ResponseError(ResponseMessage.RESTAURANT_NOT_EXISTS, StatusCode.NOT_FOUND));
            return;
        }

        res.contentType(ContentType.JSON);
        res.end(JSON.stringify(existingRestaurant));
    }

    static async getFoodItem(req: Request<any>, res: Response, next: NextFunction) {
        const foodItemId = req.params.foodItemId;

        const foodRepository = AppDataSource.getRepository(FoodItem);
        const existingFood = await foodRepository.findOne({
            where: {
                id: foodItemId,
            },
            relations: ['restaurant','priceHistory'],
        });

        if (!existingFood) {
            next(new ResponseError(ResponseMessage.FOOD_NOT_EXISTS, StatusCode.NOT_FOUND));
            return;
        }


        res.contentType(ContentType.JSON);
        res.end(JSON.stringify(existingFood));
    }

    static async searchFood(req: Request<any>, res: Response, next: NextFunction) {
        const body = req.body;

        if (!body.searchText) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        body.searchText = body.searchText.toLowerCase()


        const foodRepository = AppDataSource.getRepository(FoodItem);

        const formattedQuery = body.searchText.trim().replace(/ /g, ' & ');
        const foodList = await foodRepository
            .createQueryBuilder()
            .select('food_item')
            .from(FoodItem, 'food_item')
            .where(
            `to_tsvector('simple',food_item.name) @@ to_tsquery('simple', :query)`,
            { query: `${formattedQuery}:*` }
            )
            .getMany();

        console.log(foodList);
        res.statusCode = StatusCode.OK;
        if (foodList.length !==0){
            res.end(JSON.stringify(foodList));
        }else{
            res.end("No Item Found");
        }
        
    }
}