import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/ErrorResponse";
import { ILogin, ILoginResponse, IRegister, IUser } from "../models";
import { FacadeService } from "../services";
import { validateLogin, validateRegister } from "../helpers/validations";
import { ValidationResult } from "joi";

const facade: FacadeService = FacadeService.get();

// @desc   Login
// @route  POST /auth/login
// @access Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const validationResult: ValidationResult<ILogin> = await validateLogin({ email, password });

    const { error } = validationResult;

    if (error) {
        return next(new ErrorResponse(error.stack, 400));
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

// @desc   Register
// @route  POST /auth/register
// @access Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const validationResult: ValidationResult<IRegister> = await validateRegister({ name, email, password });

    const { error } = validationResult;

    if (error) {
        return next(new ErrorResponse(error.stack, 400));
    }

    const user: IUser = await facade.saveUser({ name, email, password });

    res.status(200).json({
        message: 'Success',
        data: user,
    });
}
