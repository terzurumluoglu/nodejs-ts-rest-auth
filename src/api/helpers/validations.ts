import Joi, { ValidationResult } from "joi";
import { ILogin, IRegister } from "../models";

export const emailSchema = (): Joi.StringSchema<string> => {
    return Joi.string().email().required();
}

export const validateLogin = (login: ILogin): ValidationResult<ILogin> => {

    const loginSchema = Joi.object<ILogin>({
        email: emailSchema(),
        password: Joi.string().required()
    });

    return loginSchema.validate(login);
};

export const validateRegister = (register: IRegister): ValidationResult<IRegister> => {

    const registerSchema = Joi.object<IRegister>({
        name: Joi.string().min(3).max(50).required(),
        email: emailSchema(),
        password: Joi.string().min(8).max(36).required()
    });

    return registerSchema.validate(register);
};
