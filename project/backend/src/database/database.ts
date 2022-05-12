import {DataSource} from "typeorm";
import {Code, FoodItem, Restaurant, User} from "./models";
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
    entities: [User, Restaurant, FoodItem, Code],
    subscribers: [],
    migrations: [],
});

export function connectDatabase() {
    AppDataSource.initialize()
        .then(() => {
            console.log('Successfully connected with database.')
        }).catch(err => {
        console.log(err);
    });
}

