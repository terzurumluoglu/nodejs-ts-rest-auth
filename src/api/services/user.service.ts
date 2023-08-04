import { Collection } from "mongodb";
import crypto from "crypto";
import { Database } from "../../config/database";
import { IToBeCreatedUser, IRegister, IUser, IMail } from "../models";
import { FacadeService } from "./facade.service";
import { promiseHandler } from "../helpers/promiseHandler";
import { ErrorResponse } from "../utils/ErrorResponse";

const USER_COLLECTION: string = 'users';
const TEN_MINS_AS_MILLI_SECONDS: number = 10 * 60 * 1000;

export class UserService {

    facade: FacadeService = FacadeService.get();

    collection: Collection = Database.get().getCollection(USER_COLLECTION);

    getUserByEmail = async (email: string): Promise<IUser> => this.collection.findOne({ email }) as Promise<IUser>;

    getUserByHashedResetPasswordKey = async (hashedResetPasswordKey: string): Promise<IUser> => {
        const now: Date = new Date(Date.now());
        const user: IUser = await this.collection.findOne({
            hashedResetPasswordKey,
            resetPasswordKeyExpire: { $gt: now }
        }) as IUser;
        if (!user) {
            throw new ErrorResponse(`The refresh password key is invalid`, 400);
        }
        return user;
    }

    setResetPasswordKeyInfo = async (url: string, email: string) => {

        const now: number = Date.now();

        const resetPasswordKey = crypto.randomBytes(32).toString('hex');
        const hashedResetPasswordKey = crypto.createHash('sha256').update(resetPasswordKey).digest('hex');
        const resetPasswordKeyExpire: Date = new Date(now + TEN_MINS_AS_MILLI_SECONDS);

        const tobeSetted = { hashedResetPasswordKey, resetPasswordKeyExpire };

        await this.updateUser({ email }, tobeSetted);

        const mailInfo: IMail = {
            to: email,
            subject: 'Reset Password Request!',
            text: `Hi, I am a mail :), I was sent to reset your password.
            You must do post request with data that includes new password this url to change your password in 10 minutes.
            ${url}/auth/resetpassword/${resetPasswordKey}`,
        };

        return this.facade.send(mailInfo);
    }

    saveUser = async (body: IRegister): Promise<IUser> => {
        const { name, email, password } = body;

        const hashedPassword: string = await this.facade.hash(password);

        const userToBeCreatedWithoutHashedPassword: IToBeCreatedUser = { name, email, createdAt: Date.now(), isActive: true, isDeleted: false, roles: ['user'] };

        const userToBeCreated: IToBeCreatedUser = { ...userToBeCreatedWithoutHashedPassword, hashedPassword };

        const { insertedId: _id } = await this.collection.insertOne(userToBeCreated);

        return { _id, ...userToBeCreatedWithoutHashedPassword };

    }

    updateUser = (params: any, tobeSetted: any): Promise<any> => this.collection.updateOne(params, { $set: tobeSetted });

}
