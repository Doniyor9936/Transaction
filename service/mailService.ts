import nodemailer, { Transporter } from "nodemailer";
import { BaseError } from "../error/errorHandler";

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_GMAIL as string,
        pass: process.env.PASS_KEY as string,
      },
    });
  }

  async sendMail(to: string, code: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MY_GMAIL,
        to,
        subject: "Email aktivlashtirish",
        text: "",
        html: `<p>Verify code: <b>${code}</b></p>`,
      });
    } catch (error) {
      console.error(error);
      throw BaseError.InternalError((error as Error).message);
    }
  }
}

export default new MailService();
