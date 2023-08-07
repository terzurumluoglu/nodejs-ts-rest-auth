import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/ErrorResponse";
import { ILogin, ILoginResponse, IRegister, IUser } from "../models";
import { FacadeService } from "../services";
import { emailSchema, validateLogin, validateRegister } from "../helpers/validations";
import { ValidationResult } from "joi";


export class Controller {

    static #instance: Controller;

    static get(): Controller {
        if (!this.#instance) {
            this.#instance = new Controller();
        }
        return this.#instance;
    }

    #facade: FacadeService = FacadeService.get();

    // @desc   Login
    // @route  POST /auth/login
    // @access Public
    login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const validationResult: ValidationResult<ILogin> = await validateLogin({ email, password });

        const { error } = validationResult;

        if (error) {
            return next(new ErrorResponse(error.stack, 400));
        }

        const userWithHashedPassword: IUser = await this.#facade.getUserByEmail(email);

        if (!userWithHashedPassword) {
            return next(new ErrorResponse('Email or Password is invalid', 404));
        }

        const { hashedPassword, ...user } = userWithHashedPassword;

        const isMatch: boolean = await this.#facade.match({ enteredPassword: password, hashedPassword });

        if (!isMatch) {
            return next(new ErrorResponse('Email or Password is invalid', 404));
        }

        const response: ILoginResponse = {
            user,
            res,
        };

        this.#facade.sendTokenResponse(response);
    };


    // @desc   Register
    // @route  POST /auth/register
    // @access Public
    register = async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password } = req.body;

        const validationResult: ValidationResult<IRegister> = await validateRegister({ name, email, password });

        const { error } = validationResult;

        if (error) {
            return next(new ErrorResponse(error.stack, 400));
        }

        const user: IUser = await this.#facade.saveUser({ name, email, password });

        const response: ILoginResponse = {
            user,
            res,
        };

        this.#facade.sendTokenResponse(response);
    }

    // @desc   Forgot Password
    // @route  POST /auth/forgotpassword
    // @access Public
    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

        const { email } = req.body;

        const { error: validationError } = emailSchema().validate(email);

        if (validationError) {
            return next(new ErrorResponse(validationError.stack, 400));
        }

        const user = await this.#facade.getUserByEmail(email);

        if (!user) {
            return next(new ErrorResponse(`There is no user this email: ${email}`, 401));
        }

        const url = req.protocol + '://' + req.get('host');
        await this.#facade.setResetPasswordKeyInfo(url, email)

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
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {

        const { resetPasswordKey } = req.params;
        const { password } = req.body;

        const hashedPassword: string = await this.#facade.hash(password);

        const hashedResetPasswordKey: string = this.#facade.generateHashedString(resetPasswordKey);

        const user: IUser = await this.#facade.getUserByHashedResetPasswordKey(hashedResetPasswordKey);

        await this.#facade.updateUser({ email: user.email }, {
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

    // @desc   Generate a new Access Token using by Refresh Token
    // @route  POST /auth/token
    // @access Public
    token = async (req: Request, res: Response, next: NextFunction) => {

        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).send('UNAUTHORIZE');
        }

        const { iat, exp, ...user } = this.#facade.verifyJWT(refreshToken);

        const response: ILoginResponse = { user, res, refreshToken };

        this.#facade.sendTokenResponse(response)
    };

    // @desc   Logout
    // @route  POST /auth/logout
    // @access Public
    logout = async (req: Request, res: Response, next: NextFunction) => {

        this.#facade.deleteCookie(res, 'accessToken', 'refreshToken');

        res.status(200).json({
            success: true,
            result: {
                message: 'Success',
            }
        });
    };
}
