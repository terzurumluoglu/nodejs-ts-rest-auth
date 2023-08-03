import { Response } from "express";
import { ICookie, IOptions } from "../models";
import { ENVIRONMENTS } from "../../constants";

const dayAsSecond = 24 * 60 * 60 * 1000;

export class CookieService {

    saveCookie = (cookieInfo: ICookie): void => {

        const { response, key, value } = cookieInfo;

        const now = Date.now();

        const options: IOptions = {
            expires: new Date(now + +process.env.JWT_COOKIE_EXPIRE * dayAsSecond),
            httpOnly: true,
        };

        if (process.env.ENVIRONMENT === ENVIRONMENTS.PRODUCTION) {
            options.secure = true;
        }

        response.cookie(key, value, options);
    };

    deleteCookie = (response: Response, ...keys: string[]): void => keys.forEach(key => response.clearCookie(key))

}
