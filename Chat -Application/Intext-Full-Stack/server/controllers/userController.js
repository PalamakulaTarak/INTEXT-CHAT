import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"
import crypto from "crypto";
import { sendMail, buildResetEmailHtml } from "../lib/mail.js";
import os from "os";

// Signup a new user
export const signup = async (req, res)=>{
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details" })
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to login a user
export const login = async (req, res) =>{    try {
        const { email, password } = req.body;
        const userData = await User.findOne({email});
        
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect){
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Login successful"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
// Controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async (req, res)=>{
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
        res.json({success: true, user: updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to start forgot password flow
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        console.log('Processing password reset for email:', email);

        const user = await User.findOne({ email });
        if (!user) {
            // For privacy, don't reveal if email exists
            return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetLink = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

        // If FRONTEND_URL is localhost, also build a LAN IP link for mobile devices on same Wi‑Fi
        let altResetLink = undefined;
        try {
            const u = new URL(frontendUrl);
            const port = u.port || '5173';
            if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                const nets = os.networkInterfaces();
                let lanIp;
                for (const name of Object.keys(nets)) {
                    for (const net of nets[name] || []) {
                        if (net.family === 'IPv4' && !net.internal) {
                            lanIp = net.address;
                            break;
                        }
                    }
                    if (lanIp) break;
                }
                if (lanIp) {
                    const altBase = `${u.protocol}//${lanIp}:${port}`;
                    altResetLink = `${altBase}/reset-password?token=${resetToken}`;
                }
            }
        } catch {}

        try {
            const result = await sendMail({
                to: email,
                subject: "Reset your Intext password",
                html: buildResetEmailHtml(resetLink, altResetLink),
                text: `Reset your Intext password: ${resetLink}${altResetLink ? `\nIf you're on mobile on the same Wi‑Fi, try this link: ${altResetLink}` : ''}`,
            });
            
            console.log('Password reset email sent:', result);
            return res.json({ 
                success: true, 
                message: "Reset link has been sent to your email.",
                debug: { resetLink, altResetLink } // Only in development
            });
        } catch (mailErr) {
            console.error("Mail send error:", mailErr);
            return res.json({ 
                success: false, 
                message: "Error sending reset email. Please try again.",
                error: process.env.NODE_ENV === 'development' ? mailErr.message : undefined
            });
        }
    } catch (error) {
        console.error("Password reset error:", error);
        res.json({ success: false, message: "An error occurred. Please try again." });
    }
};

// Controller to reset password using token
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.json({ success: false, message: "Token and new password are required" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired reset token" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}