import {NextFunction, Request, Response} from "express";
import {CatPost} from "./models";
import {UploadedFile} from "express-fileupload";
import {ResponseMessages, StatusCode} from "./rest.util";
import {UtilService} from "./util.service";
import {StoreService} from "./store";
import {FirestoreService} from "./firestore";
import {ResponseError} from "./middlewares";
import {Endpoints} from "./endpoints";
import {TranslateService} from "./translate";
import {VisionService} from "./vision";

export class Controller {

    static async getCatPost(req: Request<any>, res: Response, next: NextFunction) {
        const postId = req.params.postId;

        const post = await FirestoreService.readData('posts', postId);
        const postData = post.data();

        res.header('Content-type', 'application/json');

        if (postData === undefined) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end('');
            return;
        }

        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify(postData));
    }

    static async getCatPostFiler(req: Request<any>, res: Response, next: NextFunction) {
        let search = req.query.search as string;

        let posts = await FirestoreService.readAllFromCollection('posts');

        if (search !== undefined) {
            search = search.toLowerCase();
            posts = posts.filter((item) => item.name.toLowerCase().includes(search));
        }

        res.header('Content-type', 'application/json');
        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify(posts));
    }

    static async addCatPost(req: Request<any>, res: Response, next: NextFunction) {
        if (!req.files) {
            res.statusCode = StatusCode.BAD_REQUEST;
            res.end('');
            return;
        }

        const image = req.files.image as UploadedFile;
        const split = image.name.split('.');

        let extension = '';
        if (split.length !== 0) {
            extension = split[split.length - 1];
        }

        const filename = `${UtilService.generateRandomString(16)}.${extension}`;
        const fileUrl = await StoreService.uploadFile(image.data, filename);

        const data: CatPost = {...req.body, creationDate: new Date(), image: fileUrl};

        if (!data.description || !data.name || !data.breed) {
            next(new ResponseError(ResponseMessages.INCOMPLETE_FORM, StatusCode.BAD_REQUEST));
            return;
        }

        const postId = UtilService.generateRandomString(16);

        await FirestoreService.addData(postId, 'posts', data);

        res.statusCode = StatusCode.CREATED;
        res.setHeader('Location', `${Endpoints.POSTS}/${postId}`);
        res.end('');
    }

    static async deleteCatPost(req: Request<any>, res: Response, next: NextFunction) {
        const postId = req.params.postId;

        const post = await FirestoreService.readData('posts', postId);
        const postData = post.data();

        res.header('Content-type', 'application/json');

        if (postData === undefined) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end('');
            return;
        }

        await FirestoreService.deletePost('posts', postId);
        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify({message: "Post deleted"}));
    }

    static async updateCatPost(req: Request<any>, res: Response, next: NextFunction) {
        const postId = req.params.postId;
        const post = await FirestoreService.readData('posts', postId);
        const postData = post.data();
        
        var statusCode, data : CatPost;
        if (postData === undefined) {
            if (!req.files) {
                res.statusCode = StatusCode.BAD_REQUEST;
                res.end('');
                return;
            }
    
            const image = req.files.image as UploadedFile;
            const split = image.name.split('.');
    
            let extension = '';
            if (split.length !== 0) {
                extension = split[split.length - 1];
            }
    
            const filename = `${UtilService.generateRandomString(16)}.${extension}`;
            const fileUrl = await StoreService.uploadFile(image.data, filename);
    
            data = {...req.body, creationDate: new Date(), image: fileUrl};
    
            if (!data.description || !data.name || !data.breed) {
                next(new ResponseError(ResponseMessages.INCOMPLETE_FORM, StatusCode.BAD_REQUEST));
                return;
            }

            statusCode = StatusCode.CREATED;
            res.setHeader('Location', `${Endpoints.POSTS}/${postId}`);

        }else{
            var fileUrl;
            if (req.files) {
                
                const image = req.files.image as UploadedFile;
                const split = image.name.split('.');
        
                let extension = '';
                if (split.length !== 0) {
                    extension = split[split.length - 1];
                }
        
                const filename = `${UtilService.generateRandomString(16)}.${extension}`;
                fileUrl = await StoreService.uploadFile(image.data, filename);
            }else{
                fileUrl = postData.image;
            }
            data = {...req.body, creationDate: postData.creationDate, image: fileUrl};
            data.breed = data.breed ? data.breed : postData.breed;
            data.name = data.name ? data.name : postData.name;
            data.description = data.description ? data.description : postData.description;
    
            statusCode = StatusCode.OK;
        }

        await FirestoreService.addData(postId, 'posts', data);
    
        res.statusCode = statusCode;
        res.end('');
    }

    static async translatePost(req: Request<any>, res: Response, next: NextFunction) {
        const postId = req.params.postId;
        let language = req.query.lang as string;


        const post = await FirestoreService.readData('posts', postId);
        let postData = post.data();

        res.header('Content-type', 'application/json');

        if (postData === undefined) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end('');
            return;
        }
        if (language !== undefined) {
            language = language.toLowerCase();
        }else{
            language="ro";
        }

        const nameArray = await TranslateService.translateText(postData.name, language);
        postData.name = nameArray[0];

        const descriptionArray = await TranslateService.translateText(postData.description, language);
        postData.description = descriptionArray[0];

        const breedArray = await TranslateService.translateText(postData.breed, language);
        postData.breed = breedArray[0];

        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify(postData));
    }

    static async labelImage(req: Request<any>, res: Response, next: NextFunction) {
        const postId = req.params.postId;

        const post = await FirestoreService.readData('posts', postId);
        let postData = post.data();

        res.header('Content-type', 'application/json');

        if (postData === undefined) {
            res.statusCode = StatusCode.NOT_FOUND;
            res.end('');
            return;
        }

        const labels = await VisionService.labelImage(postData.image);
        postData.tags = labels;

        res.statusCode = StatusCode.OK;
        res.end(JSON.stringify(postData));
    }
}