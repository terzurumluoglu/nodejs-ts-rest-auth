import { NextFunction, Request, Response } from "express";
import swaggerUi from 'swagger-ui-express';
import { app } from "./server";

import { Router } from "./api/routes/auth.route";
import { errorHandler } from "./api/middlewares/errorHandler";
import { OPTIONS } from './constants/swagger';

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.redirect('/docs');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(OPTIONS));

app.use('/api', (req,res,next) => {
    res.status(200).json({
        message: 'Message from api path',
    })
});

app.use('/auth', Router.get().routes);
app.use(errorHandler);
