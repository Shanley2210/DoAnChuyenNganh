const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

/**
 * Gửi email sử dụng transporter đã cấu hình
 * @param {string} to - Email người nhận
 * @param {string} subject - Chủ đề email
 * @param {string} text - Nội dung (dạng text)
 * @param {string} [html] - Nội dung (dạng HTML, tùy chọn)
 */

const sendMail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: `"Đặt lịch khám bệnh" <${process.env.MAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html || text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(
            `Email đã gửi thành công đến: ${to}. Message ID: ${info.messageId}`
        );
        return info;
    } catch (error) {
        console.error(`Lỗi khi gửi email đến ${to}:`, error);

        throw new Error('Không thể gửi email. Vui lòng thử lại.');
    }
};

module.exports = { sendMail };
