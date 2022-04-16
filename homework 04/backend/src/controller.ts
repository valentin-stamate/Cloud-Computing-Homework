import {Request, Response} from "express";
import {recipeContainer} from "./database";
import {ContentType} from "./content.type";
import {ResponseMessage, StatusCode} from "./rest.utils";
import {Recipe} from "./models";
import {UploadedFile} from "express-fileupload";

export class Controller {

    static async getRecipes(req: Request<any>, res: Response) {

        const { resources: itemDefList } = await recipeContainer.items.readAll().fetchAll();

        res.contentType(ContentType.JSON);
        res.end(JSON.stringify(itemDefList));
    }

    static async createRecipe(req: Request<any>, res: Response) {
        if (!req.files) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.COMPLETE_ALL_FIELDS);
            return;
        }

        const file = req.files.file as UploadedFile;
        const body = req.body;

        if (!body.name || !body.description || !body.items) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end(ResponseMessage.COMPLETE_ALL_FIELDS);
            return;
        }

        body.items = JSON.parse(body.items);

        const recipe: Recipe = {
            name: body.name,
            description: body.description,
            items: body.items,
            imageBuffer: file.data,
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
            const file = files.file as UploadedFile;
            body.imageBuffer = file.data;
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
            imageBuffer: updatedData.imageBuffer || oldData.imageBuffer,
            tags: updatedData.tags || oldData.tags,
        };

        await item.replace(newData);

        res.statusCode = StatusCode.OK;
        res.end();
    }

}