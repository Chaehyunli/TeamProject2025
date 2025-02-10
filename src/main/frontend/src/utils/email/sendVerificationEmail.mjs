import nodemailer from 'nodemailer';
import { generateVerificationEmail } from './generateVerificationEmail.mjs';

export async function sendVerificationEmail(to, username, verificationLink) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const emailHTML = generateVerificationEmail(username, verificationLink);

    await transporter.sendMail({
        from: '"TeamProject2025" <no-reply@teamproject.com>',
        to,
        subject: '이메일 인증 요청',
        html: emailHTML,
    });
}



/* 💡 Descriptions
*
*      generateVerificationEmail.mjs 에서 HTML 로 바꾼 이메일 템플릿을 로드한 후
*      nodemailer 를 이용해서 Gmail SMTP 로 이메일 전송한다.
* */

// ⚠️ .env 파일에 GMAIL_User 와 GMAIL_PASS 값을 설정해야 Gmail SMTP 인증 가능하다.
// ⚠️ 계정 털리기 싫으면 .env 파일은 .gitignore 에 추가한다.