'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [
            {
                name: 'Nguyễn Trung Hiếu',
                email: 'sysadmin@test.com',
                phone: '09123456789',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Nguyễn Trung Hiếu',
                email: 'hopistaladmin@test.com',
                phone: '09123456780',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Lê Thị Mai',
                email: 'le.thi.mai@test.com',
                phone: '09870000001',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Phạm Văn An',
                email: 'pham.van.an@test.com',
                phone: '09870000002',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hoàng Thị Dung',
                email: 'hoang.thi.dung@test.com',
                phone: '09870000003',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Vũ Quốc Tuấn',
                email: 'vu.quoc.tuan@test.com',
                phone: '09870000004',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Đỗ Ngọc Hạnh',
                email: 'do.ngoc.hanh@test.com',
                phone: '09870000005',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Trương Văn Kiên',
                email: 'truong.van.kien@test.com',
                phone: '09870000006',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Phan Thị Hồng',
                email: 'phan.thi.hong@test.com',
                phone: '09870000007',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Ngô Văn Bảo',
                email: 'ngo.van.bao@test.com',
                phone: '09870000008',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Bùi Thị Ngọc',
                email: 'bui.thi.ngoc@test.com',
                phone: '09870000009',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Nguyễn Hoàng Long',
                email: 'nguyen.hoang.long@test.com',
                phone: '09770000001',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Trần Thị Lan',
                email: 'tran.thi.lan@test.com',
                phone: '09770000002',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Phùng Văn Huy',
                email: 'phung.van.huy@test.com',
                phone: '09770000003',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Võ Thị Kim Anh',
                email: 'vo.thi.kim.anh@test.com',
                phone: '09770000004',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Đặng Quốc Việt',
                email: 'dang.quoc.viet@test.com',
                phone: '09770000005',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Lê Văn Phúc',
                email: 'le.van.phuc@test.com',
                phone: '09670000001',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hà Thị Yến',
                email: 'ha.thi.yen@test.com',
                phone: '09670000002',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Phạm Nhật Quang',
                email: 'pham.nhat.quang@test.com',
                phone: '09670000003',
                password:
                    '$2b$10$ATqYJmj/YPwkA/BouqkJsuHCY.uD8VHqIwlUNanIkmI/zN.BqMXg6',
                verify: true,
                otp: null,
                otpExpires: null,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
