import { NextFunction, Request, Response } from "express";

import { ErrorResponse } from "../utils/ErrorResponse";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};
