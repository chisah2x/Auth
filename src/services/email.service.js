import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: config.googleUserEmail,
        clientId: config.googleClientID,
        clientSecret: config.googleClientSecret,
        refreshToken: config.googleRefreshToken,
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error setting up email transporter:", error);
    } else {
        console.log("Email transporter is ready to send messages");
    }
});

export const sendEmail = async(to, subject, text, html) => {
    try{
        const info = await transporter.sendMail({
            from: `Auth APP <${config.googleUserEmail}>`,
            to,
            subject,
            text,
            html
        });
    }catch(err){
        console.error("Error sending email:", err);
    }
};

// export default sendEmail;