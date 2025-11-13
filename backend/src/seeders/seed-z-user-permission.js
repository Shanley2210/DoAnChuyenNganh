'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const UserPermissions = [
            // ===== System Admin (userId: 1) =====
            { userId: 1, permissionId: 1 }, // system_management
            { userId: 1, permissionId: 2 }, // user_manage_all
            { userId: 1, permissionId: 3 }, // user_view_all
            { userId: 1, permissionId: 11 }, // view_user_detail

            // ===== Hospital Admin (userId: 2) =====
            { userId: 2, permissionId: 2 }, // user_manage_all
            { userId: 2, permissionId: 3 }, // user_view_all
            { userId: 2, permissionId: 4 }, // doctor_manage
            { userId: 2, permissionId: 7 }, // service_manage
            { userId: 2, permissionId: 10 }, // doctor_schedule_manage
            { userId: 2, permissionId: 11 }, // view_user_detail

            // ===== Patients (userId: 3 → 11) =====
            { userId: 3, permissionId: 8 }, // patient_book_appointment
            { userId: 3, permissionId: 9 }, // profile_manage

            { userId: 4, permissionId: 8 },
            { userId: 4, permissionId: 9 },

            { userId: 5, permissionId: 8 },
            { userId: 5, permissionId: 9 },

            { userId: 6, permissionId: 8 },
            { userId: 6, permissionId: 9 },

            { userId: 7, permissionId: 8 },
            { userId: 7, permissionId: 9 },

            { userId: 8, permissionId: 8 },
            { userId: 8, permissionId: 9 },

            { userId: 9, permissionId: 8 },
            { userId: 9, permissionId: 9 },

            { userId: 10, permissionId: 8 },
            { userId: 10, permissionId: 9 },

            { userId: 11, permissionId: 8 },
            { userId: 11, permissionId: 9 },

            // ===== Doctors (userId: 12 → 16) =====
            { userId: 12, permissionId: 5 }, // patient_view_medical_history
            { userId: 12, permissionId: 11 }, // view_user_detail
            { userId: 12, permissionId: 12 }, // view_doctor_schedule
            { userId: 12, permissionId: 13 }, //view_doctor_appointment

            { userId: 13, permissionId: 5 },
            { userId: 13, permissionId: 11 },
            { userId: 13, permissionId: 12 },
            { userId: 13, permissionId: 13 },

            { userId: 14, permissionId: 5 },
            { userId: 14, permissionId: 11 },
            { userId: 14, permissionId: 12 },
            { userId: 14, permissionId: 13 },

            { userId: 15, permissionId: 5 },
            { userId: 15, permissionId: 11 },
            { userId: 15, permissionId: 12 },
            { userId: 15, permissionId: 13 },

            { userId: 16, permissionId: 5 },
            { userId: 16, permissionId: 11 },
            { userId: 16, permissionId: 12 },
            { userId: 16, permissionId: 13 }
        ];
        // Thêm trường thời gian
        const finalUserPermissions = UserPermissions.map((item) => ({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        return queryInterface.bulkInsert(
            'UserPermissions',
            finalUserPermissions
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('UserPermissions', null, {});
    }
};
