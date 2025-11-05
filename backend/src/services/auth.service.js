const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const { sendMail } = require('../utils/sendMail');
const { generateOTP } = require('../utils/generateOTP');
const { where, Op } = require('sequelize');
require('dotenv').config();

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const sendOtpEmail = async (email, otp) => {
    const subject = 'Mã OTP xác thực đăng ký';
    const text = `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 3 phút.`; //
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Xác thực tài khoản phòng khám</h2>
        <p>Cảm ơn bạn đã đăng ký. Vui lòng sử dụng mã OTP sau để hoàn tất:</p>
        <p style="font-size: 24px; font-weight: bold; color: #1a73e8;">${otp}</p>
        <p>Mã này sẽ hết hạn sau <strong>3 phút</strong>.</p>
      </div>
    `;

    await sendMail(email, subject, text, html);
};

const sendForgotPasswordEmail = async (email, otp) => {
    const subject = 'Khôi phục mật khẩu';
    const text = `Mã OTP khôi phục mật khẩu của bạn là: ${otp}. Mã này sẽ hết hạn sau 3 phút.`;
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Khôi phục mật khẩu</h2>
            <p>Bạn đã yêu cầu khôi phục mật khẩu. Vui lòng sử dụng mã OTP sau:</p>
            <p style="font-size: 24px; font-weight: bold; color: #1a73e8;">${otp}</p>
            <p>Mã này sẽ hết hạn sau <strong>3 phút</strong>.</p>
            <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email.</p>
        </div>
    `;

    await sendMail(email, subject, text, html);
};

const registerService = (name, email, phone, password, confirmPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (password !== confirmPassword) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Password and confirm password do not match'
                });
            }

            const existingVerifiedUser = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: email }, { phone: phone }],
                    verify: true
                }
            });

            if (existingVerifiedUser) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Email or phone number already in use'
                });
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);

            const user = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: email }, { phone: phone }],
                    verify: false
                }
            });

            if (user) {
                user.name = name;
                user.email = email;
                user.phone = phone;
                user.password = hashPassword;
                user.otp = otp;
                user.otpExpires = otpExpiry;
                await user.save();
            } else {
                await db.User.create({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashPassword,
                    otp: otp,
                    otpExpires: otpExpiry,
                    verify: false,
                    role: 'patient'
                });
            }

            await sendOtpEmail(email, otp);

            return resolve({
                errCode: 0,
                message:
                    'Registration successful. Please check your email for OTP.'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const verifyEmailService = (email, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({ where: { email: email } });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            if (user.verify) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Email is already verified'
                });
            }

            if (user.otp !== otp || user.otpExpires < new Date()) {
                return resolve({
                    errCode: 4,
                    errMessage: 'OTP is invalid or has expired.'
                });
            }

            user.verify = true;
            user.otp = null;
            user.otpExpires = null;

            const tokens = generateTokens(user);
            user.refreshToken = tokens.refreshToken;

            await user.save();
            return resolve({
                errCode: 0,
                message: 'Email verified successfully',
                tokens: tokens
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const resendOtpService = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({ where: { email: email } });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            if (user.verify) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Email is already verified'
                });
            }

            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);

            user.otp = otp;
            user.otpExpires = otpExpiry;
            await user.save();

            await sendOtpEmail(email, otp);

            return resolve({
                errCode: 0,
                message: 'OTP resent successfully. Please check your email.'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const loginService = (emailOrPhone, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
                    verify: true
                }
            });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Incorrect email/phone or password'
                });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Incorrect email/phone or password'
                });
            }

            const tokens = generateTokens(user);
            user.refreshToken = tokens.refreshToken;
            await user.save();

            return resolve({
                errCode: 0,
                message: 'Login successful',
                tokens: tokens
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const logoutService = (refreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { refreshToken: refreshToken }
            });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            user.refreshToken = null;
            await user.save();

            return resolve({
                errCode: 0,
                message: 'Logout successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const forgotPasswordService = (emailOrPhone) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
                    verify: true
                }
            });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found or not verified'
                });
            }

            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);
            user.otp = otp;
            user.otpExpires = otpExpiry;
            await user.save();

            await sendForgotPasswordEmail(user.email, otp);

            return resolve({
                errCode: 0,
                message:
                    'OTP for password reset sent successfully. Please check your email.'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const resetPasswordService = (
    emailOrPhone,
    otp,
    newPassword,
    confirmNewPassword
) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (newPassword !== confirmNewPassword) {
                return resolve({
                    errCode: 2,
                    errMessage: 'New password and confirm password do not match'
                });
            }

            const user = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
                    verify: true
                }
            });

            if (!user) {
                return resolve({
                    errCode: 3,
                    errMessage: 'User not found'
                });
            }

            if (user.otp !== otp || user.otpExpires < new Date()) {
                return resolve({
                    errCode: 4,
                    errMessage: 'OTP is invalid or has expired.'
                });
            }

            const hashPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashPassword;
            user.otp = null;
            user.otpExpires = null;
            await user.save();

            return resolve({
                errCode: 0,
                message: 'Password reset successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const refreshTokenService = (refreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const refreshTokenFromDb = await db.User.findOne({
                where: { refreshToken: refreshToken }
            });

            if (!refreshTokenFromDb) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Invalid refresh token.'
                });
            }

            jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET,
                async (err, decoded) => {
                    if (err) {
                        return resolve({
                            errCode: 3,
                            errMessage: 'Invalid or expired refresh token.'
                        });
                    }

                    const userId = decoded.id;
                    const user = await db.User.findOne({
                        where: { id: userId, verify: true }
                    });

                    if (!user) {
                        return resolve({
                            errCode: 4,
                            errMessage: 'User not found.'
                        });
                    }

                    const newTokens = jwt.sign(
                        {
                            id: user.id,
                            role: user.role
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );

                    return resolve({
                        errCode: 0,
                        message: 'Token refreshed successfully.',
                        accessToken: newTokens
                    });
                }
            );
        } catch (e) {
            return reject(e);
        }
    });
};

const getProfileService = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: userId, verify: true },
                attributes: {
                    exclude: [
                        'password',
                        'verify',
                        'otp',
                        'otpExpires',
                        'refreshToken'
                    ]
                }
            });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User not found'
                });
            }

            return resolve({
                errCode: 0,
                message: 'Get profile successful',
                data: user
            });
        } catch (e) {
            return reject(e);
        }
    });
};

const putProfileService = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = {};
            if (data.name !== undefined) {
                userData.name = data.name;
            }
            if (data.phone !== undefined) {
                userData.phone = data.phone;
            }

            if (Object.keys(userData).length > 0) {
                await db.User.update(userData, {
                    where: { id: userId }
                });
            }

            return resolve({
                errCode: 0,
                message: 'Update profile successful'
            });
        } catch (e) {
            return reject(e);
        }
    });
};

module.exports = {
    registerService,
    verifyEmailService,
    resendOtpService,
    loginService,
    logoutService,
    forgotPasswordService,
    resetPasswordService,
    refreshTokenService,
    getProfileService,
    putProfileService
};
