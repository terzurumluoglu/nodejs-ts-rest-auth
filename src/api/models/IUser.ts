import { ObjectId, WithId } from "mongodb";

export interface IUser extends WithId<Document> {
    _id: ObjectId;
    name: string;
    email: string;
    createdAt: number;
    isActive: boolean;
    isDeleted: boolean;
    resetPasswordKey?: string;
    resetPasswordKeyExpire?: Date;
    hashedPassword?: string;
    roles: string[];
}
