import nodemailer from "nodemailer";
// import { createTransport } from "nodemailer";

const MAIL_CONFIG = {
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
};

const requestResetOTP = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      ...MAIL_CONFIG,
    });
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, Helvetica, sans-serif;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #007BFF;
                        color: #fff;
                        padding: 20px;
                        text-align: center;
                    }
                    .content {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .content h2 {
                        margin: 0;
                        color: #333;
                    }
                    .content p {
                        margin: 20px 0;
                        color: #777;
                    }
                    .btn {
                        background-color: #007BFF;
                        color: #fff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        display: inline-block;
                    }
                    .footer {
                        margin-top: 20px;
                        padding: 10px;
                        background-color: #f4f4f4;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset</h1>
                    </div>
                    <div class="content">
                        <h2>Hello,</h2>
                        <p>We received a request to reset your password. If you did not make this request, you can safely ignore this email.</p>
                        <p>To reset your password, use the one-time-password  (OTP) below:</p>
                        <h1 style=" font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 32px; color: #black;">${otp}</h1>
                        <p> This code expires in 5 minutes</p>
                    </div>
                    <div class="footer" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                        <p>If you have any questions, please contact our support team.</p>
                                <p>To stop receiving these emails, you can <a href="#" target="_blank">unsubscribe</a> at any time.</p>
                        <p>Closestead Inc, Lagos, Nigeria.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log(`${info.messageId}`);
    console.log(info.response);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default requestResetOTP;
