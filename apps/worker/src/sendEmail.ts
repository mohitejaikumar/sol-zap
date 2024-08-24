import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendEmail(to: string, body: string) {
    console.log("sending email");
    await transport.sendMail({
        from: "mohite8599@gmail.com",
        sender: "mohite8599@gmail.com",
        to,
        subject: "SolZap Notification",
        text: body
    })
    console.log("Email sent!");
}