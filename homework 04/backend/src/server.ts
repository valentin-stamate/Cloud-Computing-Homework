import express = require("express");
import {main} from "./database";

const app = express();
const port = 8080;
const host = `http://localhost:${port}`

main().catch(err => {
    console.error(err);
});

app.get('/', (req, res) => {
    res.end('Hello word!')
});

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});