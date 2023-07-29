import { getCollection } from "../../config/db";
import { IToBeCreatedUser, IRegister, IUser } from "../models";
import { FacadeService } from "./facade.service";

const USER_COLLECTION: string = 'users';

export class UserService {

    facade: FacadeService = FacadeService.get();

    getUserByEmail = async (email: string): Promise<IUser> => {
        const user = (await getCollection(USER_COLLECTION).findOne({ email })) as IUser;
        if (!user) {
            throw new Error(`There is no user this email: ${email}`);
        }
        return user;
    }

    saveUser = async (body: IRegister) => {
        const { name, email, password } = body;

        const hashedPassword: string = await this.facade.hash(password);

        const userToBeCreatedWithoutHashedPassword: IToBeCreatedUser = { name, email, createdAt: Date.now(), isActive: true, isDeleted: false, roles: ['user'] };

        const userToBeCreated: IToBeCreatedUser = { ...userToBeCreatedWithoutHashedPassword, hashedPassword };

        const { insertedId: _id } = await getCollection(USER_COLLECTION).insertOne(userToBeCreated);

        return { _id, ...userToBeCreatedWithoutHashedPassword };

    }
}
