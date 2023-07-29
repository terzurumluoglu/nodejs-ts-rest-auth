import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/ErrorResponse";
import { ILoginResponse, IUser } from "../models";
import { FacadeService } from "../services";

const facade: FacadeService = FacadeService.get();

// @desc   Login
// @route  POST /auth/login
// @access Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Email and Password must enter', 400));
    }

    const userWithHashedPassword: IUser = await facade.getUserByEmail(email);
    const { hashedPassword, ...user } = userWithHashedPassword;

    if (!user) {
        return next(new ErrorResponse('Email and Password is invalid', 404));
    }

    const isMatch: boolean = await facade.match({ enteredPassword: password, hashedPassword });

    if (!isMatch) {
        return next(new ErrorResponse('Email and Password is invalid', 404));
    }

    const response: ILoginResponse = {
        user,
        res,
    };

    facade.sendTokenResponse(response);
};
