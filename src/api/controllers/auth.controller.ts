import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/ErrorResponse";
import { IUser } from "../models/IUser";
import { ILoginResponse } from "../models/ILogin";
import { BcryptService, JWTService, UserService } from "../services";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Email and Password must enter', 400));
    }

    const userService: UserService = new UserService();
    const userWithHashedPassword: IUser = await userService.getUserByEmail(email);
    const { hashedPassword, ...user } = userWithHashedPassword;

    if (!user) {
        return next(new ErrorResponse('Email and Password is invalid', 404));
    }

    const bcryptService: BcryptService = new BcryptService();

    const isMatch: boolean = await bcryptService.match({ enteredPassword: password, hashedPassword });

    if (!isMatch) {
        return next(new ErrorResponse('Email and Password is invalid', 404));
    }

    const response: ILoginResponse = {
        user,
        res,
    };

    const jwtService: JWTService = new JWTService();
    jwtService.sendTokenResponse(response);
};
