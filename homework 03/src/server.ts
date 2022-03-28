import express = require("express");
import {Controller} from "./controller";
import {Endpoints} from "./endpoints";
import fileUpload from "express-fileupload";
import {Middleware} from "./middlewares";


const app = express();
const port = 8080;
const host = `http://localhost:${port}`

app.get('/', (req, res) => {
    res.end('Hello word!')
});

app.use(express.json());
app.use(fileUpload());

app.get(`${Endpoints.POSTS}/:postId`, Controller.getCatPost);
app.get(`${Endpoints.POSTS}`, Controller.getCatPostFiler);
app.post(Endpoints.POSTS, Controller.addCatPost);
app.delete(`${Endpoints.POSTS}/:postId`, Controller.deleteCatPost);
app.put(`${Endpoints.POSTS}/:postId`, Controller.updateCatPost);

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});

/** Error handler */
app.use(Middleware.errorHandler);