import { Response } from "express";
import { ICookie } from "../models/ICookie";

export class CookieService {

    saveCookie = (cookieInfo: ICookie) => {
        const { response, key, value, options } = cookieInfo;
        response.cookie(key, value, options);
    };

    deleteCookie = (response: Response, ...keys: [string]) => keys.forEach(key => response.clearCookie(key))

}
