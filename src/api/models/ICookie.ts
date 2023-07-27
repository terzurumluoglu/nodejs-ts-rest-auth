import { Response } from "express";

export interface ICookie {
    response: Response;
    key: string;
    value: string;
    options: IOptions;
}

export interface IOptions {
    expires: Date,
    httpOnly: boolean;
};
