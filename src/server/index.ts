import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { connectDatabase } from '../config/db';
import { BASE_PATH, ENVIRONMENTS } from "../constants";

export const app: Express = express();

const PORT = process.env.PORT || 8080;

let environmentPath = `${BASE_PATH}environment.env`;

if (process.env.ENVIRONMENT === ENVIRONMENTS.PRODUCTION) {
    environmentPath = `${BASE_PATH}environment.prod.env`;
}

dotenv.config({ path: environmentPath });

if (process.env.ENVIRONMENT === ENVIRONMENTS.DEVELOPMENT) {
    app.use(cors({ origin: '*', methods: '*' }));
}

app.use(express.json());
app.use(cookieParser());

connectDatabase();

app.listen(PORT, () => {
    console.log(`The server is running on: ${PORT}`);
});