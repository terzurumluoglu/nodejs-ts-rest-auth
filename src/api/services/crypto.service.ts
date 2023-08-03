import crypto from "crypto";

export class CryptoService {

    generateString = (): string => crypto.randomBytes(32).toString('hex');

    generateHashedString = (text: string): string => crypto.createHash('sha256').update(text).digest('hex')

}
