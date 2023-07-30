import Joi, { ValidationResult } from "joi";
import { ILogin, IRegister } from "../models";

export const validateLogin = (login: ILogin): ValidationResult<ILogin> => {

    const loginSchema = Joi.object<ILogin>({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    return loginSchema.validate(login);
};

export const validateRegister = (register: IRegister): ValidationResult<IRegister> => {

    const registerSchema = Joi.object<IRegister>({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(36).required()
    });

    return registerSchema.validate(register);
};
