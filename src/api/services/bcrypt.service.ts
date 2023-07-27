import bcryptjs from "bcryptjs";

export class BcryptService {

    hash = async (password: string): Promise<string> => {
        const salt: string = await bcryptjs.genSalt(10);
        return bcryptjs.hash(password, salt);
    }

    match = (password: { enteredPassword: string, hashedPassword: string }): Promise<boolean> => {
        const { enteredPassword, hashedPassword } = password;
        return bcryptjs.compare(enteredPassword, hashedPassword);
    }
}
