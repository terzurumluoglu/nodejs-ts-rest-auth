import crypto from "crypto";

export class CryptoService {

    generateString = () => crypto.randomBytes(32).toString('hex');

    generateHashedString = (text: string) => crypto.createHash('sha256').update(text).digest('hex')

}
