import { NextFunction, Request, Response } from "express";
import { app } from "./server";

import { authRoute } from "./api/routes/auth.route";
import { errorHandler } from "./api/middlewares/errorHandler";

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'Hello World'
    });
});

app.use('/api', (req,res,next) => {
    res.status(200).json({
        message: 'Message from api path',
    })
});

app.use('/auth', authRoute);
app.use(errorHandler);
