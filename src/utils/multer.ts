import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        const randomName = crypto.randomBytes(20).toString("hex");
        const extension = path.extname(file.originalname);

        cb(null, `${randomName}${extension}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

export default upload;
