import { NextFunction, Request, Response } from "express";
import { app } from "./server";

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
