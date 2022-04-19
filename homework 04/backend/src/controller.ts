import {Request, Response} from "express";
import {recipeContainer} from "./database";
import {ContentType} from "./content.type";
import {ResponseMessage, StatusCode} from "./rest.utils";
import {Recipe} from "./models";
import {UploadedFile} from "express-fileupload";
import {UtilService} from "./util.service";
import {StoreService} from "./storage.service";

export class Controller {

    static async getRecipes(req: Request<any>, res: Response) {
        const { resources: itemDefList } = await recipeContainer.items.readAll().fetchAll();

        res.contentType(ContentType.JSON);
        res.end(JSON.stringify(itemDefList));
    }

    static async createRecipe(req: Request<any>, res: Response) {
        console.log(req.body);
        if (!req.files) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.COMPLETE_ALL_FIELDS);
            return;
        }

        const image = req.files.file as UploadedFile;
        const body = req.body;

        if (!body.name || !body.description || !body.items || !image) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.COMPLETE_ALL_FIELDS);
            return;
        }

        body.items = JSON.parse(body.items);

        const split = image.name.split('.');

        let extension = '';
        if (split.length !== 0) {
            extension = split[split.length - 1];
        }

        const filename = `${UtilService.generateRandomString(16)}.${extension}`;
        const fileUrl = await StoreService.uploadFile(image.data, filename) as string;

        const recipe: Recipe = {
            name: body.name,
            description: body.description,
            items: body.items,
            imageUrl: fileUrl,
            /* TODO: Using Vision Api, fill the tags field */
            tags: [],
        };

        await recipeContainer.items.create(recipe);

        res.statusCode = StatusCode.CREATED;
        res.end();
    }

    static async deleteRecipe(req: Request<any>, res: Response) {
        const id = req.params.id;

        if (!id) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.MISSING_ID);
            return;
        }

        const item = await recipeContainer.item(id, id);

        if (!item) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end();
            return;
        }

        await item.delete();
        res.statusCode = StatusCode.OK;
        res.end();
    }

    static async updateRecipe(req: Request<any>, res: Response) {
        const id = req.params.id;
        const files = req.files;
        const body = req.body;
        console.log(body);
        if (!id) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.MISSING_ID);
            return;
        }

        const item = await recipeContainer.item(id, id);

        if (!item) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end();
            return;
        }

        if (body.items) {
            body.items = JSON.parse(body.items);
        }

        if (files && files.file) {
            const image = files.file as UploadedFile;
            const split = image.name.split('.');

            let extension = '';
            if (split.length !== 0) {
                extension = split[split.length - 1];
            }

            const filename = `${UtilService.generateRandomString(16)}.${extension}`;
            const fileUrl = await StoreService.uploadFile(image.data, filename) as string;

            body.imageUrl = fileUrl;

            /* TODO: Using Vision Api, fill the tags field */
            body.tags = [];
        }

        /* The actual data */
        const oldData = (await item.read()).resource as Recipe;

        if (!oldData) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end();
            return;
        }

        const updatedData = body;

        console.log(updatedData);
        console.log(oldData);

        const newData: Recipe = {
            id: updatedData.id || oldData.id,
            name: updatedData.name || oldData.name,
            description: updatedData.description || oldData.description,
            items: updatedData.items || oldData.items,
            imageUrl: updatedData.imageUrl || oldData.imageUrl,
            tags: updatedData.tags || oldData.tags,
        };

        await item.replace(newData);

        res.statusCode = StatusCode.OK;
        res.end();
    }

}