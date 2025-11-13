const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    const token = tokenHeader && tokenHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            errCode: 401,
            errMessage: 'No token provided'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({
                errCode: 403,
                errMessage: 'Invalid or expired token'
            });
        }

        try {
            const user = await db.User.findOne({
                where: { id: decoded.id, verify: true },
                include: [
                    {
                        model: db.Role,
                        as: 'roles',
                        through: { attributes: [] }
                    },
                    {
                        model: db.Permission,
                        as: 'permissions',
                        through: { attributes: [] }
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({
                    errCode: 404,
                    errMessage: 'User not found'
                });
            }

            req.user = user;
            next();
        } catch (e) {
            console.error('verifyToken error:', e);
            return res.status(500).json({
                errCode: 500,
                errMessage: 'Server error'
            });
        }
    });
};

const verifyRole = (roleName) => {
    return async (req, res, next) => {
        try {
            const hasRole = req.user.roles?.some(
                (r) => r.name.toLowerCase() === roleName.toLowerCase()
            );

            if (!hasRole) {
                return res.status(403).json({
                    errCode: 403,
                    errMessage: `Access denied: requires role ${roleName}`
                });
            }

            next();
        } catch (e) {
            console.error('verifyRole error:', e);
            return res.status(500).json({
                errCode: 500,
                errMessage: 'Server error'
            });
        }
    };
};

const verifyRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const userRoles = req.user.roles?.map((r) => r.name) || [];

            const hasRole = roles.some((role) =>
                userRoles
                    .map((r) => r.toLowerCase())
                    .includes(role.toLowerCase())
            );

            if (!hasRole) {
                return res.status(403).json({
                    errCode: 403,
                    errMessage: 'Require one of roles: ' + roles.join(', ')
                });
            }

            next();
        } catch (e) {
            console.error('verifyRoles error:', e);
            return res.status(500).json({
                errCode: 500,
                errMessage: 'Server error'
            });
        }
    };
};

const verifyPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const userPermissions =
                req.user.permissions?.map((p) => p.name.toLowerCase()) || [];

            if (!userPermissions.includes(permissionName.toLowerCase())) {
                return res.status(403).json({
                    errCode: 403,
                    errMessage: `Access denied: requires permission ${permissionName}`
                });
            }

            next();
        } catch (e) {
            console.error('verifyPermission error:', e);
            return res.status(500).json({
                errCode: 500,
                errMessage: 'Server error'
            });
        }
    };
};

module.exports = {
    verifyToken,
    verifyRole,
    verifyRoles,
    verifyPermission
};
