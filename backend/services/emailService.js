const transporter = require('../config/mail');

const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Admin Login OTP - Digital Hotel',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Digital Hotel</h2>
                    <p>Hello Admin,</p>
                    <p>Your OTP for admin login is:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">${otp}</span>
                    </div>
                    <p style="color: #666; font-size: 14px;">This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 Digital Hotel. All rights reserved.</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

module.exports = {
    sendOTP,
};
