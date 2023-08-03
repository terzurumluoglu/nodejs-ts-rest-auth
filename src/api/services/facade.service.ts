import { Response } from "express";
import { ICookie, ILoginResponse, IMail, IRegister, IUser } from "../models";
import { BcryptService, CookieService, CryptoService, JWTService, MailService, UserService } from "./";

export class FacadeService {

    #bcryptService: BcryptService;
    #cookieService: CookieService;
    #cryptoService: CryptoService;
    #jwtService: JWTService;
    #mailService: MailService;
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

    deleteCookie = (response: Response, ...keys: string[]) => this.cookieService.deleteCookie(response, ...keys);
    //#endregion

    //#region CryptoService
    private get cryptoService(): CryptoService {
        if (!this.#cryptoService) {
            this.#cryptoService = new CryptoService();
        }
        return this.#cryptoService;
    }

    generateString = (): string => this.cryptoService.generateString();
    
    generateHashedString = (text: string): string => this.cryptoService.generateHashedString(text);
    //#endregion

    //#region JWTService
    private get jwtService(): JWTService {
        if (!this.#jwtService) {
            this.#jwtService = new JWTService();
        }
        return this.#jwtService;
    }

    generateJWT = (user: IUser): string => this.jwtService.generateJWT(user);

    generateRefreshToken = (user: IUser): string => this.jwtService.generateRefreshToken(user);

    verifyJWT = (refreshToken: string) => this.jwtService.verifyJWT(refreshToken);

    sendTokenResponse = (response: ILoginResponse) => this.jwtService.sendTokenResponse(response);
    //#endregion

    //#region MailService
    private get mailService(): MailService {
        if (!this.#mailService) {
            this.#mailService = new MailService();
        }
        return this.#mailService;
    }

    send = (mailInfo: IMail): Promise<any> => this.mailService.send(mailInfo);
    //#endregion

    //#region UserService
    private get userService(): UserService {
        if (!this.#userService) {
            this.#userService = new UserService();
        }
        return this.#userService;
    }

    getUserByEmail = (email: string): Promise<IUser> => this.userService.getUserByEmail(email);

    getUserByHashedResetPasswordKey = (hashedResetPasswordKey: string): Promise<IUser> => this.userService.getUserByHashedResetPasswordKey(hashedResetPasswordKey);

    setResetPasswordKeyInfo = (url: string, email: string): Promise<any> => this.userService.setResetPasswordKeyInfo(url, email);

    saveUser = (body: IRegister): Promise<IUser> => this.userService.saveUser(body);

    updateUser = async (params: any, tobeSetted: any): Promise<any> => this.userService.updateUser(params, tobeSetted);
    //#endregion
}
