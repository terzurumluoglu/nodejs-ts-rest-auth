import { Response } from "express";
import { IUser } from "./IUser";

export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister extends ILogin {
    name: string;
}

export interface ILoginResponse {
    user: IUser,
    res: Response,
    refreshToken?: string;
}
