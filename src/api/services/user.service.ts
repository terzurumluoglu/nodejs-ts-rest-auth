import { Collection } from "mongodb";
import { Database } from "../../config/database";
import { IToBeCreatedUser, IRegister, IUser } from "../models";
import { FacadeService } from "./facade.service";

const USER_COLLECTION: string = 'users';

export class UserService {

    facade: FacadeService = FacadeService.get();

    collection: Collection = Database.get().getCollection(USER_COLLECTION);

    getUserByEmail = async (email: string): Promise<IUser> => {
        const user = (await this.collection.findOne({ email })) as IUser;
        if (!user) {
            throw new ErrorResponse(`There is no user this email: ${email}`, 404);
        }
        return user;
    }
    setResetPasswordKeyInfo = async (url: string, email: string) => {

        const now: number = Date.now();

        const resetPasswordKey = crypto.randomBytes(32).toString('hex');
        const hashedResetPasswordKey = crypto.createHash('sha256').update(resetPasswordKey).digest('hex');
        const resetPasswordKeyExpire: Date = new Date(now + TEN_MINS_AS_MILLI_SECONDS);

        const tobeSetted = { hashedResetPasswordKey, resetPasswordKeyExpire };

        const { error } = await promiseHandler(this.updateUser({ email }, tobeSetted));

        if (error) {
            return new ErrorResponse('ERROR', 500);
        }

        const mailInfo: IMail = {
            to: email,
            subject: 'Reset Password Request!',
            text: `Hi, I am a mail :), I was sent to reset your password.
            You must do post request with data that includes new password this url to change your password in 10 minutes.
            ${url}/auth/resetpassword/${resetPasswordKey}`,
        };

        return this.facade.send(mailInfo);
    }

    saveUser = async (body: IRegister) => {
        const { name, email, password } = body;

        const hashedPassword: string = await this.facade.hash(password);

        const userToBeCreatedWithoutHashedPassword: IToBeCreatedUser = { name, email, createdAt: Date.now(), isActive: true, isDeleted: false, roles: ['user'] };

        const userToBeCreated: IToBeCreatedUser = { ...userToBeCreatedWithoutHashedPassword, hashedPassword };

        const { insertedId: _id } = await this.collection.insertOne(userToBeCreated);

        return { _id, ...userToBeCreatedWithoutHashedPassword };

    }

    updateUser = async (params: any, tobeSetted: any) => this.collection.updateOne(params, { $set: tobeSetted });

}
