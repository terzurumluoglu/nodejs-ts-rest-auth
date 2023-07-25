import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { connectDatabase } from './config/db';
import { BASE_PATH } from "./constants";

const app: Express = express();

const PORT = 8080;

let environmentPath = `${BASE_PATH}environment.env`;

dotenv.config({ path: environmentPath });

connectDatabase();

app.listen(PORT, () => {
    console.log(`The server is running on: ${PORT}`);
});

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'Hello World'
    });
})