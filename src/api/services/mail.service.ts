import { SendMailOptions, SentMessageInfo, Transporter, createTransport } from "nodemailer";
import { IMail } from "../models";

export class MailService {

    #client: Transporter<SentMessageInfo>;

    constructor() {
        this.#client = createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    send = (mailInfo: IMail): Promise<any> => {
        const mailOptions: SendMailOptions = { ...mailInfo, from: process.env.MAIL_USER };
        return this.#client.sendMail(mailOptions)
    }

}
