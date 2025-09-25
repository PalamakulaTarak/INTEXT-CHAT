import express from "express";
import nodemailer from "nodemailer";
import { sendMail } from "../lib/mail.js";

const router = express.Router();

router.post("/test-email", async (req, res) => {
    try {
        // Create test account and get credentials
        const testAccount = await nodemailer.createTestAccount();
        
        // Create transporter with test account
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        // Send test email
        const info = await transporter.sendMail({
            from: '"QuickChat Test" <test@quickchat.com>',
            to: req.body.email || "palamakulatarak2803@gmail.com",
            subject: "Test Email from QuickChat",
            html: "<h1>Test Email</h1><p>This is a test email to verify the email sending functionality.</p>",
            text: "Test Email - This is a test email to verify the email sending functionality."
        });

        // Get preview URL
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log("Preview URL:", previewUrl);

        res.json({ 
            success: true, 
            message: "Test email sent successfully!",
            previewUrl,
            messageId: info.messageId
        });
    } catch (error) {
        console.error("Email test error:", error);
        res.json({ success: false, error: error.message });
    }
});

export default router;
