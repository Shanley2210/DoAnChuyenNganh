const crypto = require('crypto');

/**
 * Tạo mã OTP ngẫu nhiên an toàn bằng crypto.
 * @param {number} length - Độ dài của OTP (mặc định là 6)
 * @returns {string} - Chuỗi mã OTP
 */
const generateOTP = (length = 6) => {
    if (length <= 0) {
        throw new Error('Độ dài OTP phải là số dương.');
    }

    const max = Math.pow(10, length);
    const otpValue = crypto.randomInt(0, max);

    return otpValue.toString().padStart(length, '0');
};

module.exports = { generateOTP };
