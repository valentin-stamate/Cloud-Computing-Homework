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
        userA.money = 50;

        const userB = new User();
        userB.name = 'Valeria';
        userB.email = 'valeria.izvoreanu@gmail.com';
        userB.address = 'Str. Albastrelelor Nr. 2';
        userB.money = 50;

        await userRepository.save(userA);
        await userRepository.save(userB);

        await foodRepository.query('DELETE FROM food_item');
        await restaurantRepository.query('DELETE FROM restaurant');

        const restaurantA = new Restaurant();
        restaurantA.name = 'Fast Pizza';
        restaurantA.profilePhotoUrl = 'http://www.foodngo.it/assets/images/data/restaurant3.jpg';
        restaurantA.coverPhotoUrl = 'https://i.pinimg.com/736x/0e/b9/9c/0eb99cd32c6f85eb628c91efb51157d4.jpg';
        restaurantA.email = 'stamatevalentin125@gmail.com';

        const restaurantB = new Restaurant();
        restaurantB.name = 'Soup Zone';
        restaurantB.profilePhotoUrl = 'https://s3-media0.fl.yelpcdn.com/bphoto/JUL9FChAKPGd5TYPmcJUPQ/l.jpg';
        restaurantB.coverPhotoUrl = 'https://i.postimg.cc/DzvXY2kh/download.jpg';
        restaurantB.email = 'stamatevalentin64@gmail.com';

        const foodItemC = new FoodItem();
        foodItemC.name = 'Pizza';
        foodItemC.price = 25;
        foodItemC.details = 'Faina, sare, masline, salam';
        foodItemC.restaurant = restaurantB;
        foodItemC.photoUrl = 'https://i.postimg.cc/gJ5LJ8wc/Zj-Nm-Yj-Rl-MDQ0-Yj-Jh-OWJj-ODc3-Mz-U3-NWVi-NGZi-OWZj-Zg-thumb.jpg';

        const restaurantC = new Restaurant();
        restaurantC.name = 'Italian';
        restaurantC.profilePhotoUrl = 'https://i.postimg.cc/LXhZ2N80/zeama-moldoveneasca-de-pui-cu-taitei-2-720x720.jpg';
        restaurantC.coverPhotoUrl = 'https://i.postimg.cc/rpftBvMr/pexels-malidate-van-784633.jpg';
        restaurantC.email = 'photo.backup.vst.02@gmail.com';

        const foodItemD = new FoodItem();
        foodItemD.name = 'Pizza Medie';
        foodItemD.price = 31;
        foodItemD.details = 'Faina, sare, masline, salam, ardei';
        foodItemD.restaurant = restaurantC;
        foodItemD.photoUrl = 'https://i.postimg.cc/Rqx31mQj/pizza.jpg';

        const foodItemA = new FoodItem();
        foodItemA.name = 'Ciorba Radauteana';
        foodItemA.price = 20;
        foodItemA.details = 'Apa 200g, Legume 200g';
        foodItemA.restaurant = restaurantA;
        foodItemA.photoUrl = 'https://retete-culinare-cu-dana-valery.ro/cdn/recipes/ciorba-radauteana-cu-carne-de-curcan.jpg';

        const priceHistoryA = new Price;
        priceHistoryA.modifyDate = new Date('04 Apr 2022 00:12:00 GMT');
        priceHistoryA.value = 21;
       // priceHistoryA.foodItem = foodItemA;

        const priceHistoryB = new Price;
        priceHistoryB.modifyDate = new Date('10 Apr 2022 00:12:00 GMT');
        priceHistoryB.value = 14;

        const priceHistoryC = new Price;
        priceHistoryC.modifyDate = new Date('20 Apr 2022 00:12:00 GMT');
        priceHistoryC.value = 25;

        const priceHistoryD = new Price;
        priceHistoryD.modifyDate = new Date('25 Apr 2022 00:12:00 GMT');
        priceHistoryD.value = 20;

        foodItemA.priceHistory = [priceHistoryA, priceHistoryB, priceHistoryC, priceHistoryD];

        const foodItemB = new FoodItem();
        foodItemB.name = 'Ciorba de Burta';
        foodItemB.price = 21;
        foodItemB.details = 'Apa 200g, Legume 210g';
        foodItemB.restaurant = restaurantA;
        foodItemB.photoUrl = 'https://www.lauralaurentiu.ro/wp-content/uploads/2010/03/ciorba-de-burta-reteta-cu-poze-cum-se-face-ciorba-de-burta-ingrediente-mod-de-preparare-ciorba-de-burta-reteta-laura-laurentiu.jpg';


        const priceHistoryE = new Price;
        priceHistoryE.modifyDate = new Date();
        priceHistoryE.value = 21;
        //priceHistoryA.foodItem = foodItemB;

        foodItemB.priceHistory = [priceHistoryE];
        restaurantA.foodItems = [foodItemA, foodItemB];

        restaurantB.foodItems = [foodItemC];
        restaurantC.foodItems = [foodItemD];

        await restaurantRepository.save(restaurantA);
        await restaurantRepository.save(restaurantB);
        await restaurantRepository.save(restaurantC);
        await AppDataSource.manager.save(priceHistoryA);
        await AppDataSource.manager.save(priceHistoryB);
        await AppDataSource.manager.save(priceHistoryC);
        await AppDataSource.manager.save(priceHistoryD);
        await AppDataSource.manager.save(priceHistoryE);
        await foodRepository.save(foodItemA);
        await foodRepository.save(foodItemB);
        await foodRepository.save(foodItemC);
        await foodRepository.save(foodItemD);
    }


}

