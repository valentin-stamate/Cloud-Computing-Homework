import express = require("express");
import {main} from "./database";
import {Endpoints} from "./endpoints";
import {Controller} from "./controller";
import cors from 'cors';
import fileUpload from "express-fileupload";

const app = express();
const port = 8080;
const host = `http://localhost:${port}`;

main().catch(err => {
    console.error(err);
});

app.use(cors({origin: '*'}));

app.use(express.json());
app.use(fileUpload());

app.get(Endpoints.RECIPES, Controller.getRecipes);
app.post(Endpoints.RECIPES, Controller.createRecipe);
app.patch(`${Endpoints.RECIPES}/:id`, Controller.updateRecipe);
app.delete(`${Endpoints.RECIPES}/:id`, Controller.deleteRecipe);
app.get(`${Endpoints.TRANSLATE}/:id`, Controller.translateRecipe);

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});