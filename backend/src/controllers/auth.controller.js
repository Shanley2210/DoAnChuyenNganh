const authService = require('../services/auth.service');

const registerController = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await authService.registerService(
            name,
            email,
            phone,
            password,
            confirmPassword
        );

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in register:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const verifyEmailController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await authService.verifyEmailService(email, otp);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in verifyEmail:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const resendOtpController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await authService.resendOtpService(email);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in resendOtp:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const loginController = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await authService.loginService(emailOrPhone, password);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in Login:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const logoutController = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await authService.logoutService(refreshToken);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in Logout:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const forgotPasswordController = async (req, res) => {
    try {
        const { emailOrPhone } = req.body;

        if (!emailOrPhone) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await authService.forgotPasswordService(emailOrPhone);

        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in forgotPassword:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { emailOrPhone, otp, newPassword, confirmNewPassword } = req.body;

        if (!emailOrPhone || !otp || !newPassword || !confirmNewPassword) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await authService.resetPasswordService(
            emailOrPhone,
            otp,
            newPassword,
            confirmNewPassword
        );
        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in resetPassword:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        const response = await authService.refreshTokenService(refreshToken);
        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in refreshToken:', e);
        return res
            .status(500)
            .json({ errCode: -1, errMessage: 'Error from server' });
    }
};

module.exports = {
    registerController,
    verifyEmailController,
    resendOtpController,
    loginController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
    refreshTokenController
};
