import { ObjectId, WithId } from "mongodb";

export interface IToBeCreatedUser {
    name: string;
    email: string;
    createdAt: number;
    isActive: boolean;
    isDeleted: boolean;
    hashedPassword?: string;
    roles: string[];
}
export interface IUser extends IToBeCreatedUser{
    _id: ObjectId;
    resetPasswordKey?: string;
    resetPasswordKeyExpire?: Date;
}
