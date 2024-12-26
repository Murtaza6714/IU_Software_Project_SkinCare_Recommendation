"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// SET STORAGE
const diskStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Audio');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
/* defined filter */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/octet-stream' ||
        file.mimetype === "audio/mpeg" ||
        file.mimetype === "audio/wav") {
        cb(null, true);
    }
    else {
        cb(new Error("File format should be PNG,JPG,JPEG for images and MP3 and WAV for audios "), false);
    }
};
exports.upload = (0, multer_1.default)({ storage: diskStorage, fileFilter: fileFilter });
