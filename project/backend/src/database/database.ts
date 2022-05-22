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
        await foodRepository.query('DELETE FROM "user"');

        const userA = new User();
        userA.name = 'Valentin';
        userA.email = 'stamatevalentin125@gmail.com';
        userA.address = 'Str. Rosiorilor Nr. 4';
        userA.money = 500;

        const userB = new User();
        userB.name = 'Valeria';
        userB.email = 'valeria.izvoreanu@gmail.com';
        userB.address = 'Str. Albastrelelor Nr. 2';
        userB.money = 500;

        await userRepository.save(userA);
        await userRepository.save(userB);

        await foodRepository.query('DELETE FROM food_item');
        await restaurantRepository.query('DELETE FROM restaurant');

        const restaurant = new Restaurant();
        restaurant.name = 'Fast Pizza';
        restaurant.profilePhotoUrl = 'http://www.foodngo.it/assets/images/data/restaurant3.jpg';
        restaurant.coverPhotoUrl = 'https://i.pinimg.com/736x/0e/b9/9c/0eb99cd32c6f85eb628c91efb51157d4.jpg';
        restaurant.email = 'stamatevalentin125@gmail.com';

        const foodItemA = new FoodItem();
        foodItemA.name = 'Ciorba Radauteana';
        foodItemA.price = 20;
        foodItemA.details = 'Apa 200g, Legume 200g';
        foodItemA.restaurant = restaurant;
        foodItemA.photoUrl = 'https://retete-culinare-cu-dana-valery.ro/cdn/recipes/ciorba-radauteana-cu-carne-de-curcan.jpg';

        const foodItemB = new FoodItem();
        foodItemB.name = 'Ciorba de Burta';
        foodItemB.price = 21;
        foodItemB.details = 'Apa 200g, Legume 210g';
        foodItemB.restaurant = restaurant;
        foodItemB.photoUrl = 'https://www.lauralaurentiu.ro/wp-content/uploads/2010/03/ciorba-de-burta-reteta-cu-poze-cum-se-face-ciorba-de-burta-ingrediente-mod-de-preparare-ciorba-de-burta-reteta-laura-laurentiu.jpg';

        restaurant.foodItems = [foodItemA, foodItemB];

        await restaurantRepository.save(restaurant);
        await foodRepository.save(foodItemA);
        await foodRepository.save(foodItemB);
    }


}

