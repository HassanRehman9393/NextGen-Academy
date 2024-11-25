class EmailTemplates {
    static getBaseTemplate(content) {
        return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://your-logo-url.com/logo.png" alt="NextGenAcademy Logo" style="max-width: 200px;">
                </div>
                ${content}
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} NextGenAcademy. All rights reserved.</p>
                    <div style="margin-top: 10px;">
                        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Contact Support</a>
                    </div>
                </div>
            </div>
        `;
    }

    static getWelcomeTemplate(username) {
        const content = `
            <h1 style="color: #2c3e50; text-align: center; font-size: 28px; margin-bottom: 30px;">Welcome to NextGenAcademy!</h1>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Dear ${username},</p>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">We're thrilled to welcome you to NextGenAcademy! Your journey towards excellence begins here.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h2 style="color: #2c3e50; font-size: 20px; margin-bottom: 15px;">Get Started with These Steps:</h2>
                <ul style="color: #34495e; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>Complete your profile to personalize your experience</li>
                    <li>Explore our diverse range of cutting-edge courses</li>
                    <li>Connect with fellow learners in our community</li>
                    <li>Set your learning goals and track your progress</li>
                </ul>
            </div>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Need help getting started? Our support team is here for you 24/7.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard" 
                   style="background-color: #3498db; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 25px; font-weight: bold;
                          display: inline-block;">
                    Go to Dashboard
                </a>
            </div>
        `;
        return {
            subject: 'Welcome to NextGenAcademy! 🎓',
            html: this.getBaseTemplate(content)
        };
    }

    static getVerificationTemplate(firstName, verificationLink) {
        const content = `
            <h1 style="color: #2c3e50; text-align: center; font-size: 28px; margin-bottom: 30px;">Verify Your Email Address</h1>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Hello ${firstName},</p>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Thank you for registering with NextGenAcademy. To ensure the security of your account and access all features, please verify your email address.</p>
            <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationLink}" 
                   style="background-color: #27ae60; color: white; padding: 14px 35px; 
                          text-decoration: none; border-radius: 25px; font-weight: bold;
                          display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #34495e; font-size: 14px; margin: 0;">
                    ⚠️ This verification link will expire in 24 hours for security reasons.<br>
                    Please note that you won't be able to access your account until your email is verified.
                </p>
            </div>
        `;
        return {
            subject: 'Verify Your Email - NextGenAcademy',
            html: this.getBaseTemplate(content)
        };
    }

    static getPasswordResetTemplate(username, resetLink) {
        const content = `
            <h1 style="color: #2c3e50; text-align: center; font-size: 28px; margin-bottom: 30px;">Password Reset Request</h1>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Dear ${username},</p>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 35px 0;">
                <a href="${resetLink}" 
                   style="background-color: #e74c3c; color: white; padding: 14px 35px; 
                          text-decoration: none; border-radius: 25px; font-weight: bold;
                          display: inline-block;">
                    Reset Password
                </a>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #34495e; font-size: 14px; margin: 0;">
                    🔒 For security: This link expires in 24 hours.<br>
                    If you didn't request this reset, please ignore this email or contact support.
                </p>
            </div>
        `;
        return {
            subject: 'Password Reset Request - NextGenAcademy',
            html: this.getBaseTemplate(content)
        };
    }

    static getPasswordChangedTemplate(username) {
        const content = `
            <h1 style="color: #2c3e50; text-align: center; font-size: 28px; margin-bottom: 30px;">Password Successfully Changed</h1>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Dear ${username},</p>
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Your password has been successfully changed. You can now log in with your new password.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #34495e; font-size: 14px; margin: 0;">
                    🔐 Security Notice:<br>
                    If you did not make this change, please contact our support team immediately.
                </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/login" 
                   style="background-color: #3498db; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 25px; font-weight: bold;
                          display: inline-block;">
                    Login to Your Account
                </a>
            </div>
        `;
        return {
            subject: 'Password Changed Successfully - NextGenAcademy',
            html: this.getBaseTemplate(content)
        };
    }
}

module.exports = EmailTemplates; 