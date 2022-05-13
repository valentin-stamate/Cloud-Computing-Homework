import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import {FoodItem} from "../database/models";

require('dotenv').config();

const env =  process.env as any;

export class MailService {

    static async sendMail(options: Mail.Options) {
        const transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_SECURE,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail(options);

        console.log(`Mail send to: ${options.to}, from ${options.from}`);
        console.log(info.messageId);

        return info;
    }

}

export enum EmailDefaults {
    FROM = 'Blazer <stamatevalentin125@gmail.com>',
    APP_NAME = 'Blazer or something',
}

export class LoginTemplate {
    static getHtml(key: string): string {
        return `Welcome, your code is ${key}.`;
    }
}

export class RestaurantOrderMail {
    static getHtml(address: string, price: number, foodList: FoodItem[]): string {
        let listHtml = foodList.reduce((pre, curr) => {
            const itemHtml = `
                <div><b>${curr.name}</b></div>
                <div>${curr.details}</div>
                <div>${curr.price}</div>
                <br>
            `;

            return pre + itemHtml;
        }, ``);

        return `
            <div>A new order has been placed to ${address}.</div>
            <div>Total price: ${price}</div>
            <br>
            <div>${listHtml}</div>
        `;
    }
}

export class UserOrderMail {
    static getHtml(address: string, price: number, foodList: FoodItem[]): string {
        let listHtml = foodList.reduce((pre, curr) => {
            const itemHtml = `
                <div><b>${curr.name}</b></div>
                <div>${curr.details}</div>
                <div>${curr.price}</div>
                <br>
            `;

            return pre + itemHtml;
        }, ``);

        return `
            <div>A new order has been placed to your address: ${address}.</div>
            <div>Total price: ${price}</div>
            <br>
            <div>${listHtml}</div>
        `;
    }
}

