import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (email, subject, text) => {

    try {
        console.log('in send email try');

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: 'dili.d61296@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });
        console.log("Email sent successfully");

    } catch (error) {
        console.log("Email not sent!");
        console.log(error);
        return error;
    }
}