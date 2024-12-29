"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDynamicSkinSummary = exports.catchError = exports.generateRandom = exports.sendEmail = exports.checkInputError = exports.comparePassword = exports.hashPassword = exports.generateToken = exports.clearImage = exports.ValidateName = exports.ValidateStatus = exports.ValidateDateFormat = exports.paramNotEmpty = exports.queryNotEmpty = exports.bodyNotEmpty = void 0;
exports.getDateTimeForToday = getDateTimeForToday;
exports.generateFileName = generateFileName;
exports.uploadBase64ImageToS3 = uploadBase64ImageToS3;
exports.createCollectionWithSchema = createCollectionWithSchema;
exports.createEdgeCollectionWithSchema = createEdgeCollectionWithSchema;
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./logger");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ejs_1 = __importDefault(require("ejs"));
const luxon_1 = require("luxon");
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = require("nodemailer");
const bucket_upload_1 = require("../middlewares/bucket-upload");
const database_1 = require("./database");
const config_1 = require("../config");
// if(process.env.SENDGRID_API_KEY !== undefined)
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const connection = {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    service: process.env.MAIL_MAILER,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
};
const transporter = (0, nodemailer_1.createTransport)({
    host: "smtp.gmail.com",
    auth: {
        user: 'mrtzsingapurwala@gmail.com',
        pass: 'pkhr pivy focd bzrm'
    },
    secure: true,
    port: 465,
    tls: { rejectUnauthorized: false },
});
const bodyNotEmpty = (key) => {
    return (0, express_validator_1.body)(key).notEmpty().withMessage(`${key} field is empty`);
};
exports.bodyNotEmpty = bodyNotEmpty;
const queryNotEmpty = (key) => {
    return (0, express_validator_1.query)(key).notEmpty().withMessage(`${key} field is empty`);
};
exports.queryNotEmpty = queryNotEmpty;
const paramNotEmpty = (key) => {
    return (0, express_validator_1.param)(key).notEmpty().withMessage(`${key} field is empty`);
};
exports.paramNotEmpty = paramNotEmpty;
const ValidateDateFormat = (key) => {
    return (0, express_validator_1.check)(key).matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).withMessage(`${key} format should be (YYYY-MM-DD)`);
};
exports.ValidateDateFormat = ValidateDateFormat;
const ValidateStatus = (key) => {
    return (0, express_validator_1.check)(key).trim().matches(/^[A-Z]+$/).withMessage(`${key} Should be in caps`);
};
exports.ValidateStatus = ValidateStatus;
const ValidateName = (key) => {
    return (0, express_validator_1.check)(key).matches(/^([a-zA-Z]+\s)*[a-zA-Z]+$/).withMessage(`${key} can contain only Uppercase, lowercase and single space`);
};
exports.ValidateName = ValidateName;
const clearImage = (path) => {
    fs_1.default.unlink(path, (err) => {
        if (err) {
            logger_1.logger.error(err);
        }
    });
};
exports.clearImage = clearImage;
const generateToken = (tokenData, secretKey, expiresIn) => {
    return jsonwebtoken_1.default.sign(tokenData, secretKey, { expiresIn: '30d' });
};
exports.generateToken = generateToken;
const hashPassword = (password) => {
    if (process.env.SALT_ROUNDS) {
        const salt = bcryptjs_1.default.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        return bcryptjs_1.default.hashSync(password, salt);
    }
};
exports.hashPassword = hashPassword;
const comparePassword = (password1, password2) => {
    return bcryptjs_1.default.compareSync(password1, password2);
};
exports.comparePassword = comparePassword;
const checkInputError = function (req, images = []) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        if (images.length > 0) {
            images.forEach((image) => {
                (0, exports.clearImage)(image.path);
            });
        }
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
};
exports.checkInputError = checkInputError;
const sendEmail = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, from, subject, templateName, data }) {
        try {
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, `../templates/${templateName}.ejs`), data, { async: true });
            const msg = {
                to,
                from,
                subject,
                html,
            };
            const mailSent = yield transporter.sendMail(msg);
            // console.log(mailSent);
            return mailSent;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
};
exports.sendEmail = sendEmail;
const generateRandom = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.generateRandom = generateRandom;
const catchError = function (err, next) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
};
exports.catchError = catchError;
function getDateTimeForToday(timezone = "Asia/Kolkata") {
    // NOTE: Change the timezone instead of America/Chicago to anything
    const today = luxon_1.DateTime.local().setZone(timezone);
    return {
        day: today.day,
        month: today.month,
        year: today.year,
        hour: today.hour,
        minute: today.minute,
        datestamp: ((today.year - 2000) + '' + ((today.month < 10 ? '0' : '') + today.month) + '' + ((today.day < 10 ? '0' : '') + today.day) + '' + ((today.hour < 10 ? '0' : '') + today.hour) + '' + ((today.minute < 10 ? '0' : '') + today.minute)),
        timestamp: today.toISO({ includeOffset: false }),
        mongoTimestamp: today.toISO({ includeOffset: true })
    };
}
function generateFileName(fileExtension) {
    // Get current date
    const currentDate = new Date();
    // Extract date components
    const year = currentDate.getFullYear() % 100;
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    // Generate random number (between 1000 and 9999)
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    // Construct file name with date stamp and random number
    const fileName = `${year}${month}${day}_${hours}${minutes}${seconds}_${randomNumber}`;
    return `${fileName}.${fileExtension}`;
}
function uploadBase64ImageToS3(base64String, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let base64Image = base64String.split(';base64,').pop();
            const fileName = generateFileName("jpeg");
            fs_1.default.writeFileSync(fileName, base64Image, { encoding: "base64" });
            const uploadResult = yield (0, bucket_upload_1.uploadPromise)(fileName, `${sessionId}/${fileName}`);
            console.log('Image uploaded successfully:');
            fs_1.default.unlinkSync(fileName);
            return uploadResult;
        }
        catch (error) {
            console.error('Error uploading image to S3:', error);
        }
    });
}
function createCollectionWithSchema(collectionName, schema) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = database_1.arangoDb.collection(collectionName);
        const exists = yield collection.exists();
        if (!exists) {
            yield database_1.arangoDb.createCollection(collectionName, { schema });
            console.log(`Collection ${collectionName} with schema created.`);
        }
        else {
            yield collection.properties({ schema });
        }
    });
}
function createEdgeCollectionWithSchema(collectionName, schema) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = database_1.arangoDb.collection(collectionName);
        const exists = yield collection.exists();
        if (!exists) {
            yield database_1.arangoDb.createEdgeCollection(collectionName, { schema });
            console.log(`Collection ${collectionName} with schema created.`);
        }
        else {
            yield collection.properties({ schema });
        }
    });
}
const generateDynamicSkinSummary = (inputAttributes) => {
    // const inputSet = new Set(inputAttributes.map(attr => attr.toUpperCase()));
    const inputSet = inputAttributes;
    const descriptions = [];
    for (const input of inputSet) {
        if (input in config_1.aiGeneratedSkinSummary)
            descriptions.push(config_1.aiGeneratedSkinSummary[input]);
    }
    // if (inputSet.includes(attributesEnum.ACNE)) {
    //     descriptions.push('Acne is affecting your skin.');
    // }
    // if (inputSet.includes(attributesEnum.EYE_BAGS)) {
    //     descriptions.push('You are dealing with noticeable eye bags.');
    // }
    // if (inputSet.includes(attributesEnum.DARK_CIRCLES)) {
    //     descriptions.push('Dark circles are present under your eyes.');
    // }
    if (descriptions.length > 0) {
        return `It seems you have the following concerns: ${descriptions.join(' ')}`;
    }
    else {
        return 'No specific concerns detected.';
    }
};
exports.generateDynamicSkinSummary = generateDynamicSkinSummary;
