class EmailTemplates {
    static getWelcomeTemplate(username) {
        return {
            subject: 'Welcome to NextGenAcademy!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50; text-align: center;">Welcome to NextGenAcademy!</h1>
                    <p>Dear ${username},</p>
                    <p>Thank you for joining NextGenAcademy! We're excited to have you as part of our learning community.</p>
                    <p>Here's what you can do next:</p>
                    <ul>
                        <li>Complete your profile</li>
                        <li>Browse our courses</li>
                        <li>Join our community discussions</li>
                    </ul>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Best regards,<br>The NextGenAcademy Team</p>
                </div>
            `
        };
    }

    static getVerificationTemplate(username, verificationLink) {
        return {
            subject: 'Verify Your Email - NextGenAcademy',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50; text-align: center;">Email Verification</h1>
                    <p>Dear ${username},</p>
                    <p>Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" 
                           style="background-color: #3498db; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px;">
                            Verify Email
                        </a>
                    </div>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p>${verificationLink}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>Best regards,<br>The NextGenAcademy Team</p>
                </div>
            `
        };
    }

    static getPasswordResetTemplate(username, resetLink) {
        return {
            subject: 'Password Reset Request - NextGenAcademy',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50; text-align: center;">Password Reset Request</h1>
                    <p>Dear ${username},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="background-color: #e74c3c; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px;">
                            Reset Password
                        </a>
                    </div>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p>${resetLink}</p>
                    <p>This link will expire in 1 hour. If you didn't request this reset, please ignore this email.</p>
                    <p>Best regards,<br>The NextGenAcademy Team</p>
                </div>
            `
        };
    }

    static getPasswordChangedTemplate(username) {
        return {
            subject: 'Password Changed Successfully - NextGenAcademy',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50; text-align: center;">Password Changed</h1>
                    <p>Dear ${username},</p>
                    <p>Your password has been successfully changed.</p>
                    <p>If you did not make this change, please contact our support team immediately.</p>
                    <p>Best regards,<br>The NextGenAcademy Team</p>
                </div>
            `
        };
    }
}

module.exports = EmailTemplates; 