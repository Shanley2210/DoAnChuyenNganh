const multer = require('multer');
const path = require('path');
const fs = require('fs');

const baseUploadDir = path.join(__dirname, '../uploads');

const createUploadImgaeDir = (subfolder) => {
    const uploadDir = path.join(baseUploadDir, subfolder);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExtension = path.extname(file.originalname);

            const fileName = `${uniqueSuffix}${fileExtension}`;

            req.savedImagePath = `uploads/${subfolder}/${fileName}`;

            cb(null, fileName);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    };

    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 1024 * 1024 * 5 }
    });
};

module.exports = {
    createUploadImgaeDir
};
