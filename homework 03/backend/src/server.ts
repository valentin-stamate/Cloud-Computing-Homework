import express = require("express");
import {Controller} from "./controller";
import {Endpoints} from "./endpoints";
import fileUpload from "express-fileupload";
import {Middleware} from "./middlewares";
import cors from 'cors';

const app = express();
const port = 8080;
const host = `http://localhost:${port}`

app.get('/', (req, res) => {
    res.end('Hello word!')
});

app.use(cors({origin: ['http://localhost:4200', 'https://cloud-computing-cce1f.web.app']}));

app.use(express.json());
app.use(fileUpload());

app.get(`${Endpoints.POSTS}/:postId`, Controller.getCatPost);
app.get(`${Endpoints.POSTS}`, Controller.getCatPostFiler);
app.get(`${Endpoints.TRANSLATE}/:postId`, Controller.translatePost);
app.get(`${Endpoints.TAGS}/:postId`, Controller.labelImage);
app.post(Endpoints.POSTS, Controller.addCatPost);
app.delete(`${Endpoints.POSTS}/:postId`, Controller.deleteCatPost);
app.put(`${Endpoints.POSTS}/:postId`, Controller.updateCatPost);

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});

/** Error handler */
app.use(Middleware.errorHandler);