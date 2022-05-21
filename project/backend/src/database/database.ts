import {DataSource} from "typeorm";
import {Code, FoodItem, Restaurant, User, Price} from "./models";
import "reflect-metadata"
require('dotenv').config();

const env = process.env as any;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Restaurant, FoodItem, Code, Price],
    subscribers: [],
    migrations: [],
});

export async function connectDatabase(rewrite: boolean = false) {
    await AppDataSource.initialize()
        .then(() => {
            console.log('Successfully connected with database.')
        }).catch(err => {
        console.log(err);
    });


    const foodRepository = AppDataSource.getRepository(FoodItem);
    const restaurantRepository = AppDataSource.getRepository(Restaurant);
    const userRepository = AppDataSource.getRepository(User);

    if (rewrite) {
        await foodRepository.query('DELETE FROM food_item');
        await restaurantRepository.query('DELETE FROM restaurant');

        const restaurant = new Restaurant();
        restaurant.name = 'Fast Pizza';
        restaurant.profilePhotoUrl = '';
        restaurant.coverPhotoUrl = '';
        restaurant.email = 'stamatevalentin125@gmail.com';

        const foodItemA = new FoodItem();
        foodItemA.name = 'Ciorba Radauteana';
        foodItemA.price = 20;
        foodItemA.details = 'Apa 200g, Legume 200g';
        foodItemA.restaurant = restaurant;

        const foodItemB = new FoodItem();
        foodItemB.name = 'Ciorba de Burta';
        foodItemB.price = 21;
        foodItemB.details = 'Apa 200g, Legume 210g';
        foodItemB.restaurant = restaurant;

        restaurant.foodItems = [foodItemA, foodItemB];

        await restaurantRepository.save(restaurant);
        await foodRepository.save(foodItemA);
        await foodRepository.save(foodItemB);
    }


}

