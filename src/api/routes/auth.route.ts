import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/asyncHandler';

export class Router {

    static #instance: Router;

    static get(): Router {
        if (!this.#instance) {
            this.#instance = new Router();
        }
        return this.#instance;
    }

    #router: express.Router = express.Router();

    private constructor() {

        const { forgotPassword, login, logout, register, resetPassword, token } = AuthController.get();

        this.#router.route('/login').post(asyncHandler(login));
        this.#router.route('/register').post(asyncHandler(register));
        this.#router.route('/forgotpassword').post(asyncHandler(forgotPassword));
        this.#router.route('/resetpassword/:resetPasswordKey').post(asyncHandler(resetPassword));
        this.#router.route('/token').post(asyncHandler(token));
        this.#router.route('/logout').post(asyncHandler(logout));

    }

    get routes() {
        return this.#router;
    }
}
