import { IUser } from "./IUser";

export interface ITokenResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}