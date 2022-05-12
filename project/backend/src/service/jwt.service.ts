import jwt from 'jsonwebtoken';
import {Restaurant, User} from "../database/models";

require('dotenv').config();
const env = process.env as any;

export class JwtService {

    static generateAccessTokenForUser(user: User) {
        return jwt.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                userType: 1,
            },
            env.TOKEN_SECRET);
    }

    static generateAccessTokenForRestaurant(restaurant: Restaurant) {
        return jwt.sign({
            id: restaurant.id,
            name: restaurant.name,
            email: restaurant.email,
            userType: 2,
        }, env.TOKEN_SECRET);
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, env.TOKEN_SECRET);
        } catch (e) {
            return null;
        }
    }

}