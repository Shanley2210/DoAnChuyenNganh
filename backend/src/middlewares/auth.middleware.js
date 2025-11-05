const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    const token = tokenHeader && tokenHeader.split(' ')[1];

    if (!token) {
        return res
            .status(401)
            .json({ errCode: 401, errMessage: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({
                errCode: 403,
                errMessage: 'Failed to authenticate token'
            });
        }

        try {
            const user = await db.User.findByPk(decoded.id);

            if (!user) {
                return res.status(404).json({
                    errCode: 404,
                    errMessage: 'User not found'
                });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res
                .status(500)
                .json({ errCode: 500, errMessage: 'Server error' });
        }
    });
};

const verifyAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            errCode: 403,
            errMessage: 'Require admin role'
        });
    }

    next();
};

const verifyDoctor = async (req, res, next) => {
    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({
            errCode: 403,
            errMessage: 'Require doctor role'
        });
    }

    next();
};

const verifySystemAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                errCode: 403,
                errMessage: 'Require admin role'
            });
        }

        const adminProfile = await db.Admin.findOne({
            where: { userId: req.user.id }
        });

        if (!adminProfile || adminProfile.roleType !== 'system') {
            return res.status(403).json({
                errCode: 403,
                errMessage: 'Require system admin role'
            });
        }

        next();
    } catch (e) {
        return res.status(500).json({
            errCode: 500,
            errMessage: 'Server error'
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifySystemAdmin,
    verifyDoctor
};
