import jwt from "jsonwebtoken";
import { ILoginResponse, ITokenResponse, IUser } from "../models";
import { FacadeService } from "./facade.service";

export class JWTService {

    facade: FacadeService = FacadeService.get();

    generateJWT = (user: IUser): string => {
        return jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
    };

    generateRefreshToken = (user: IUser): string => {
        return jwt.sign(user, process.env.REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_EXPIRE
        });
    };

    verifyJWT = (refreshToken: string): any => {
        return jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    };

    sendTokenResponse = (response: ILoginResponse) => {

        const { user, res, refreshToken } = response;

        const accessToken: string = this.generateJWT(user);

        const result: ITokenResponse = { accessToken, refreshToken, user: undefined };

        this.facade.saveCookie({ response: res, key: 'accessToken', value: accessToken })

        if (!refreshToken) {
            result.refreshToken = this.generateRefreshToken(user);
            result.user = user;
            this.facade.saveCookie({ response: res, key: 'refreshToken', value: result.refreshToken });
        }

        res.status(200).send({
            success: true,
            result,
        });
    }
}
