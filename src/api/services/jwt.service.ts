import jwt from "jsonwebtoken";
import { IUser } from "../models/IUser";

export class JWTService {

    generateJWT = (user: IUser) => {
        return jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
    };

    generateRefreshToken = (user: IUser) => {
        return jwt.sign(user, process.env.REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_EXPIRE
        });
    };

    verifyJWT = (refreshToken: string) => {
        return jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    };
}