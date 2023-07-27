import { getCollection } from "../../config/db";
import { IUser } from "../models/IUser";

export class UserService {

    getUserByEmail = async (email: string): Promise<IUser> => {
        const user = (await getCollection('users').findOne({ email })) as IUser;
        if (!user) {
            throw new Error(`There is no user this email: ${email}`);
        }
        return user;
    }
}
