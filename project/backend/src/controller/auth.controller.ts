import {NextFunction, Request, Response} from "express";
import {Code, Restaurant, User} from "../database/models";
import {ResponseMessage, StatusCode} from "../util/rest.utils";
import {AppDataSource} from "../database/database";
import {JwtService} from "../service/jwt.service";
import {EmailDefaults, LoginTemplate, MailService} from "../service/mail.service";
import {UtilService} from "../service/util.service";
import {UploadedFile} from "express-fileupload";

export class AuthController {
    /* -----------======================== User ========================----------- */
    static async userLogin(req: Request<any>, res: Response, next: NextFunction) {
        const body = req.body as User;

        if (!body.name || !body.email) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const user = new User();
        user.name = body.name;
        user.email = body.email;

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy([
            {name: user.name, email: user.email},
        ]);

        if (!existingUser) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.USER_NOT_EXISTS);
            return;
        }

        const randomCode = UtilService.generateRandomString(16);

        const codeRepository = AppDataSource.getRepository(Code);
        const codeModel = new Code();
        codeModel.code = randomCode;
        await AppDataSource.manager.save(codeModel);

        await codeModel

        try {
            const mailHtml = LoginTemplate.getHtml(randomCode);
            await MailService.sendMail({
                from: EmailDefaults.FROM,
                to: existingUser.email,
                html: mailHtml,
            });
        } catch (err) {
            console.log(err);

            res.statusCode = StatusCode.SERVICE_UNAVAILABLE;
            res.end(ResponseMessage.ERROR_SENDING_MAIL);
            return;
        }

        res.statusCode = StatusCode.OK;
        res.end();
    }

    static async userLoginWithCode(req: Request<any>, res: Response, next: NextFunction) {
        const body = req.body;

        if (!body.name || !body.email || !body.code) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const user = new User();
        user.name = body.name;
        user.email = body.email;

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy([
            {name: user.name, email: user.email},
        ]);

        if (!existingUser) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.USER_NOT_EXISTS);
            return;
        }

        const code = body.code;

        const codeRepository = AppDataSource.getRepository(Code);
        const existingCode = await codeRepository.findOneBy([
            {code: code},
        ]);

        if (!existingCode) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_CODE);
            return;
        }

        const token = JwtService.generateAccessTokenForUser(existingUser);

        res.statusCode = StatusCode.OK;
        res.end(token);
    }

    static async userSignup(req: Request<any>, res: Response, next: NextFunction) {
        const body = req.body as User;

        if (!body.name || !body.email) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const user = new User();
        user.name = body.name;
        user.email = body.email;

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy([
            {name: user.name},
            {email: user.email},
        ]);

        if (existingUser) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.CREDENTIALS_ALREADY_TAKEN);
            return;
        }

        await AppDataSource.manager.save(user);
        console.log(`New user saved with id: ${user.id}`);

        res.end('Hello');
    }

    /* -----------======================== Restaurant ========================----------- */
    static async restaurantLogin(req: Request<any>, res: Response, next: NextFunction) {
        const body = req.body as Restaurant;

        if (!body.name || !body.email) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const restaurant = new Restaurant();
        restaurant.name = body.name;
        restaurant.email = body.email;

        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOneBy([
            {name: restaurant.name, email: restaurant.email},
        ]);

        if (!existingRestaurant) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }

        const randomCode = UtilService.generateRandomString(16);

        const codeRepository = AppDataSource.getRepository(Code);
        const codeModel = new Code();
        codeModel.code = randomCode;
        await AppDataSource.manager.save(codeModel);

        await codeModel

        try {
            const mailHtml = LoginTemplate.getHtml(randomCode);
            await MailService.sendMail({
                from: EmailDefaults.FROM,
                to: existingRestaurant.email,
                html: mailHtml,
            });
        } catch (err) {
            console.log(err);

            res.statusCode = StatusCode.SERVICE_UNAVAILABLE;
            res.end(ResponseMessage.ERROR_SENDING_MAIL);
            return;
        }

        res.statusCode = StatusCode.OK;
        res.end();
    }

    static async restaurantLoginWithCode(req: Request<any>, res: Response, next: NextFunction) {
        const body = req.body;

        if (!body.name || !body.email || !body.code) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const restaurant = new Restaurant();
        restaurant.name = body.name;
        restaurant.email = body.email;

        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOneBy([
            {name: restaurant.name, email: restaurant.email},
        ]);

        if (!existingRestaurant) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end(ResponseMessage.RESTAURANT_NOT_EXISTS);
            return;
        }

        const code = body.code;

        const codeRepository = AppDataSource.getRepository(Code);
        const existingCode = await codeRepository.findOneBy([
            {code: code},
        ]);

        if (!existingCode) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_CODE);
            return;
        }

        const token = JwtService.generateAccessTokenForRestaurant(existingRestaurant);

        res.statusCode = StatusCode.OK;
        res.end(token);
    }

    static async restaurantSignup(req: Request<any>, res: Response, next: NextFunction) {
        const body = req.body as Restaurant;

        if (!req.files) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const profilePhoto = req.files.profilePhoto as UploadedFile;
        const coverPhoto = req.files.coverPhoto as UploadedFile;

        if (!profilePhoto || !coverPhoto) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.MISSING_PHOTO);
            return;
        }

        if (!body.name || !body.email) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.INVALID_FORM);
            return;
        }

        const restaurant = new Restaurant();
        restaurant.name = body.name;
        restaurant.email = body.email;

        /* TODO: Using a Google Cloud service, get the url for the two photos and put them here */
        restaurant.profilePhotoUrl = '';
        restaurant.coverPhotoUrl = '';

        const restaurantRepository = AppDataSource.getRepository(Restaurant);
        const existingRestaurant = await restaurantRepository.findOneBy([
            {name: restaurant.name},
            {email: restaurant.email},
        ]);

        if (existingRestaurant) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.CREDENTIALS_ALREADY_TAKEN);
            return;
        }

        await AppDataSource.manager.save(restaurant);
        console.log(`New restaurant saved with id: ${restaurant.id}`);

        res.end('Hello');
    }

}