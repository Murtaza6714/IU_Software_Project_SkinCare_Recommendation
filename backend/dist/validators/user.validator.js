"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserValidator = exports.loginValidator = void 0;
const utils_1 = require("../utils");
exports.loginValidator = [
    (0, utils_1.bodyNotEmpty)("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    (0, utils_1.bodyNotEmpty)("inputType").trim().isIn(["email", "phoneNumber"]).withMessage("inputType value should be email or phoneNumber")
];
exports.saveUserValidator = [
    (0, utils_1.bodyNotEmpty)("phoneNumber").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    (0, utils_1.bodyNotEmpty)("email").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase())
];
