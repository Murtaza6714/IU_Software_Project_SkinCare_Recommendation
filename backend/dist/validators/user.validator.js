"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserValidator = exports.verifyOtpValidator = exports.sendOtpValidator = exports.saveUserValidator = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
exports.loginValidator = [
    (0, utils_1.bodyNotEmpty)("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    (0, utils_1.bodyNotEmpty)("inputType").trim().isIn(["email", "phoneNumber"]).withMessage("inputType value should be email or phoneNumber")
];
exports.saveUserValidator = [
    (0, utils_1.bodyNotEmpty)("phoneNumber").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    (0, utils_1.bodyNotEmpty)("email").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase())
];
exports.sendOtpValidator = [
    (0, utils_1.bodyNotEmpty)("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    (0, utils_1.bodyNotEmpty)("inputType").trim().isIn(["email", "phoneNumber"]).withMessage("inputType value should be email or phoneNumber")
];
exports.verifyOtpValidator = [
    (0, utils_1.bodyNotEmpty)("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    (0, utils_1.bodyNotEmpty)("action").withMessage("action variable should not be empty!!"),
    (0, utils_1.bodyNotEmpty)("otp").withMessage("otp variable should not be empty!!")
];
exports.fetchUserValidator = [
    (0, express_validator_1.query)("email").optional({ checkFalsy: true }).trim().toLowerCase().isEmail().withMessage("email should be an email address!!"),
    (0, express_validator_1.query)("page").optional({ checkFalsy: true }).isNumeric().withMessage('Page should be numeric!'),
    (0, express_validator_1.query)("limit").optional({ checkFalsy: true }).isNumeric().withMessage('Limit should be numeric!'),
    (0, express_validator_1.query)("search").optional({ checkFalsy: true }).trim(),
];
