import { getCollection } from "../../config/db";
import { IUser } from "../models/IUser";

const USER_COLLECTION: string = 'users';

export class UserService {

    getUserByEmail = async (email: string): Promise<IUser> => {
        const user = (await getCollection(USER_COLLECTION).findOne({ email })) as IUser;
        if (!user) {
            throw new Error(`There is no user this email: ${email}`);
        }
        return user;
    }
}
