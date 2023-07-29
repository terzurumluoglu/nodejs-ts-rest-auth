import { Response } from "express";
import { ICookie } from "../models/ICookie";
import { ILoginResponse, IRegister } from "../models/ILogin";
import { IUser } from "../models/IUser";
import { BcryptService, CookieService, JWTService, UserService } from "./";

export class FacadeService {

    #bcryptService: BcryptService;
    #cookieService: CookieService;
    #jwtService: JWTService;
    #userService: UserService;

    static #instance: FacadeService;

    static get(): FacadeService {
        if (!this.#instance) {
            this.#instance = new FacadeService();
        }
        return this.#instance;
    }

    //#region BcryptService
    private get bcryptService(): BcryptService {
        if (!this.#bcryptService) {
            this.#bcryptService = new BcryptService();
        }
        return this.#bcryptService;
    }

    hash = (password: string) => this.bcryptService.hash(password);

    match = (password: { enteredPassword: string, hashedPassword: string }) => this.bcryptService.match(password);
    //#endregion

    //#region CookieService
    private get cookieService(): CookieService {
        if (!this.#cookieService) {
            this.#cookieService = new CookieService();
        }
        return this.#cookieService;
    }

    saveCookie = (cookieInfo: ICookie) => this.cookieService.saveCookie(cookieInfo);

    deleteCookie = (response: Response, ...keys: [string]) => this.cookieService.deleteCookie(response, ...keys);
    //#endregion

    //#region JWTService
    private get jwtService(): JWTService {
        if (!this.#jwtService) {
            this.#jwtService = new JWTService();
        }
        return this.#jwtService;
    }

    generateJWT = (user: IUser) => this.jwtService.generateJWT(user);

    generateRefreshToken = (user: IUser) => this.jwtService.generateRefreshToken(user);

    verifyJWT = (refreshToken: string) => this.jwtService.verifyJWT(refreshToken);

    sendTokenResponse = (response: ILoginResponse) => this.jwtService.sendTokenResponse(response);
    //#endregion

    //#region UserService
    private get userService(): UserService {
        if (!this.#userService) {
            this.#userService = new UserService();
        }
        return this.#userService;
    }

    getUserByEmail = (email: string) => this.userService.getUserByEmail(email);

    saveUser = (body: IRegister) => this.userService.saveUser(body)
    //#endregion
}