import express from 'express';
import {connectDatabase} from "./database/database";
import {Middleware} from "./controller/middlewares";
import fileUpload from "express-fileupload";
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
require('dotenv').config();

const env = process.env;

const app = express();
const port = env.PORT;
const host = `http://localhost:${port}`;

connectDatabase();

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/

app.set('json spaces', 4);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Handle logs in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    app.use(cors({origin: ['*']}));
}

// Handle security and origin in production
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

/************************************************************************************
 *                               Register all REST routes
 ***********************************************************************************/
app.use(fileUpload());

app.get('/', (req, res) => {
    res.end('Hello word!')
});

/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/
app.use(Middleware.errorHandler);

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});