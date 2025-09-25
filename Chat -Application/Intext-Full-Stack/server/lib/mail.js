import nodemailer from 'nodemailer';

// Normalize app password (remove quotes, spaces and non-alphanumerics)
const normalizePass = (pwd) => (pwd || '').replace(/[^A-Za-z0-9]/g, '');

const gmailUser = process.env.GMAIL_USER; // required
const gmailPass = normalizePass(process.env.GMAIL_APP_PASSWORD); // required

if (!gmailUser || !gmailPass) {
    console.error('Gmail credentials missing. Set GMAIL_USER and GMAIL_APP_PASSWORD in server/.env');
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: gmailUser, pass: gmailPass },
});

export const sendMail = async ({ to, subject, html, text }) => {
    try {
        if (!gmailUser || !gmailPass) throw new Error('Missing Gmail credentials.');
        const from = process.env.MAIL_FROM || `"QuickChat Support" <${gmailUser}>`;
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        error._public = { code: error.code, command: error.command, response: error.response };
        throw error;
    }
};

export const buildResetEmailHtml = (resetLink, altResetLink) => {
    const altSection = altResetLink ? `
  <p style="margin: 8px 0 0 0;">On mobile on the same Wi‑Fi? Try this link:</p>
  <p style="word-break: break-all; color: #0EA5E9;">${altResetLink}</p>
` : '';

    const html = `
<div style="font-family: Arial, sans-serif; padding: 24px; background: #042f2e; color: #e5e7eb;">
  <h2 style="margin: 0 0 16px 0; color: #22C55E;">Reset your Intext password</h2>
  <p style="margin: 0 0 12px 0;">We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
  <p style="margin: 24px 0;">
    <a href="${resetLink}" style="background: linear-gradient(90deg,#22C55E,#0EA5E9); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; display: inline-block; transition: opacity 0.2s;">Reset Password</a>
  </p>
  <p style="margin: 0 0 8px 0;">If the button doesn't work, copy and paste this URL into your browser:</p>
  <p style="word-break: break-all; color: #0EA5E9;">${resetLink}</p>
  ${altSection}
  <p style="margin-top: 24px; color: #9ca3af;">If you didn't request this, you can safely ignore this email.</p>
</div>`;
    return html;
};