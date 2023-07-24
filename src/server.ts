import express, { Express } from "express";

const app: Express = express();

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`The server is running on: ${PORT}`);
});
