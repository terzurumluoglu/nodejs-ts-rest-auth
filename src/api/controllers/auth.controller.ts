import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/ErrorResponse";
import { ILogin, ILoginResponse, IRegister, IUser } from "../models";
import { FacadeService } from "../services";
import { emailSchema, validateLogin, validateRegister } from "../helpers/validations";
import { ValidationResult } from "joi";
import { promiseHandler } from "../helpers/promiseHandler";

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

    if (!userWithHashedPassword) {
        return next(new ErrorResponse('Email or Password is invalid', 404));
    }

    const { hashedPassword, ...user } = userWithHashedPassword;

    const isMatch: boolean = await facade.match({ enteredPassword: password, hashedPassword });

    if (!isMatch) {
        return next(new ErrorResponse('Email or Password is invalid', 404));
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

// @desc   Forgot Password
// @route  POST /auth/forgotpassword
// @access Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

    const { email } = req.body;

    const { error: validationError } = emailSchema().validate(email);

    if (validationError) {
        return next(new ErrorResponse(validationError.stack, 400));
    }

    const user = await facade.getUserByEmail(email);

    if (!user) {
        return next(new ErrorResponse(`There is no user this email: ${email}`, 401));
    }

    const url = req.protocol + '://' + req.get('host');

    const { error } = await promiseHandler(facade.setResetPasswordKeyInfo(url, email));

    if (error) {
        console.log(error);
        return new ErrorResponse('ERROR', 500);
    }

    res.status(200).send({
        success: true,
        result: {
            message: 'Email was sent successfully',
        },
    })
};

// @desc   Reset Password
// @route  POST /auth/resetpassword/{resetPasswordKey}
// @access Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {

    const { resetPasswordKey } = req.params;
    const { password } = req.body;

    const hashedPassword: string = await facade.hash(password);

    const hashedResetPasswordKey: string = facade.generateHashedString(resetPasswordKey);

    const user: IUser = await facade.getUserByHashedResetPasswordKey(hashedResetPasswordKey);

    await facade.updateUser({ email: user.email }, {
        hashedPassword,
        hashedResetPasswordKey: undefined,
        resetPasswordKeyExpire: undefined
    });

    res.status(200).send({
        success: true,
        result: {
            message: 'Email was sent successfully',
            user
        },
    })
};

// @desc   Logout
// @route  POST /auth/logout
// @access Public
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    
    facade.deleteCookie(res, 'accessToken', 'refreshToken');

    res.status(200).json({
        success: true,
        result: {
            message: 'Success',
        }
    });
};
