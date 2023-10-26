import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { Database } from '../config/database';
import { BASE_PATH, ENVIRONMENTS } from "../constants";

export class App {
    #server: Express = express();

    #PORT = process.env.PORT || 8080;

    #environmentPath = `${BASE_PATH}environment.env`;

    static #instance: App;

    static get(): App {
        if (!this.#instance) {
            this.#instance = new App();
        }
        return this.#instance;
    }

    private constructor() {

        if (process.env.ENVIRONMENT === ENVIRONMENTS.PRODUCTION) {
            this.#environmentPath = `${BASE_PATH}environment.prod.env`;
        }

        dotenv.config({ path: this.#environmentPath });

        if (process.env.ENVIRONMENT === ENVIRONMENTS.DEVELOPMENT) {
            this.#server.use(cors({ origin: '*', methods: '*' }));
        }

        this.#server.use(express.json());
        this.#server.use(cookieParser());

        Database.get();

        this.#server.listen(this.#PORT, () => {
            console.log(`The server is running on: ${this.#PORT}`);
        });
    }

    get server() {
        return this.#server;
    }
}
