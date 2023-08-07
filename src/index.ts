import { Express, NextFunction, Request, Response } from "express";
import swaggerUi from 'swagger-ui-express';
import { App } from "./server";

import { Router } from "./api/routes/auth.route";
import { errorHandler } from "./api/middlewares/errorHandler";
import { OPTIONS } from './constants/swagger';

export class Main {

    static #instance: Main;

    static get(): Main {
        if (!this.#instance) {
            this.#instance = new Main();
        }
        return this.#instance;
    }

    constructor() {
        const app: App = App.get();
        const server: Express = app.server;

        server.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.redirect('/docs');
        });

        server.use('/docs', swaggerUi.serve, swaggerUi.setup(OPTIONS));

        server.use('/api', (req, res, next) => {
            res.status(200).json({
                message: 'Message from api path',
            })
        });

        server.use('/auth', Router.get().routes);
        server.use(errorHandler);
    }
}

Main.get();
