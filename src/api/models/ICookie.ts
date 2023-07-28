import { Response } from "express";

export interface ICookie {
    response: Response;
    key: string;
    value: string;
}

export interface IOptions {
    expires: Date,
    httpOnly: boolean;
    secure?: boolean;
};
