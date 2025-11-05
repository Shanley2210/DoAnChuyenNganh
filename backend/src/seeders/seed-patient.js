'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Patients', [
            {
                userId: '3',
                dob: '1999-05-14',
                gender: '1',
                ethnicity: 'Kinh',
                address: '123 Lý Thường Kiệt, Q.10, TP.HCM',
                insuranceTerm: '2024-01-01 to 2025-01-01',
                insuranceNumber: 'HS123456789',
                familyAddress: 'Phường 10, Q.10, TP.HCM',
                notePMH: 'Từng bị viêm họng mãn tính',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '4',
                dob: '2001-09-23',
                gender: '0',
                ethnicity: 'Kinh',
                address: '45 Trần Hưng Đạo, Q.5, TP.HCM',
                insuranceTerm: '2023-06-01 to 2025-06-01',
                insuranceNumber: 'HS987654321',
                familyAddress: 'Q.5, TP.HCM',
                notePMH: 'Không có tiền sử bệnh nghiêm trọng',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '5',
                dob: '2003-10-22',
                gender: '1',
                ethnicity: 'Hoa',
                address: '78 Nguyễn Văn Cừ, Q.1, TP.HCM',
                insuranceTerm: '2024-03-01 to 2025-03-01',
                insuranceNumber: 'HS456789123',
                familyAddress: 'Phường Cầu Kho, Q.1, TP.HCM',
                notePMH: 'Dị ứng nhẹ với phấn hoa',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '6',
                dob: '1998-02-11',
                gender: '1',
                ethnicity: 'Kinh',
                address: '12 Nguyễn Huệ, TP. Huế',
                insuranceTerm: '2022-11-01 to 2025-11-01',
                insuranceNumber: 'HS112233445',
                familyAddress: 'Phường Phú Hội, TP. Huế',
                notePMH: 'Tiền sử đau dạ dày',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '7',
                dob: '2000-07-06',
                gender: '0',
                ethnicity: 'Tày',
                address: '24 Nguyễn Trãi, Hà Nội',
                insuranceTerm: '2023-01-15 to 2025-01-15',
                insuranceNumber: 'HS998877665',
                familyAddress: 'Đống Đa, Hà Nội',
                notePMH: 'Thiếu máu nhẹ, đã điều trị ổn định',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '8',
                dob: '1997-03-17',
                gender: '1',
                ethnicity: 'Kinh',
                address: '56 Pasteur, Q.3, TP.HCM',
                insuranceTerm: '2024-04-01 to 2025-04-01',
                insuranceNumber: 'HS223344556',
                familyAddress: 'Phường 6, Q.3, TP.HCM',
                notePMH: 'Tiền sử viêm da dị ứng',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '9',
                dob: '1995-12-09',
                gender: '0',
                ethnicity: 'Kinh',
                address: '9 Nguyễn Văn Linh, Đà Nẵng',
                insuranceTerm: '2023-10-01 to 2025-10-01',
                insuranceNumber: 'HS667788990',
                familyAddress: 'Q. Hải Châu, Đà Nẵng',
                notePMH: 'Bị đau lưng nhẹ do công việc ngồi lâu',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '10',
                dob: '2002-11-28',
                gender: '1',
                ethnicity: 'Kinh',
                address: '14 Trần Phú, Nha Trang',
                insuranceTerm: '2024-02-01 to 2025-02-01',
                insuranceNumber: 'HS334455667',
                familyAddress: 'Phường Lộc Thọ, Nha Trang',
                notePMH: 'Không có tiền sử bệnh nghiêm trọng',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: '11',
                dob: '2004-04-05',
                gender: '0',
                ethnicity: 'Nùng',
                address: '2A Lạc Long Quân, Hà Nội',
                insuranceTerm: '2023-08-01 to 2025-08-01',
                insuranceNumber: 'HS778899001',
                familyAddress: 'Q. Tây Hồ, Hà Nội',
                notePMH: 'Từng bị hen suyễn thời nhỏ',
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
