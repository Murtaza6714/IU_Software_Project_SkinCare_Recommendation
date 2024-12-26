"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAppoinmentValidator = exports.createAppoinmentValidator = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
exports.createAppoinmentValidator = [
    (0, utils_1.bodyNotEmpty)("serviceName").trim(),
    (0, utils_1.bodyNotEmpty)("serviceAmount").trim().isInt().withMessage("serviceAmount should be an integer!"),
    (0, utils_1.bodyNotEmpty)("paymentLink").trim(),
    (0, utils_1.bodyNotEmpty)("email").trim().toLowerCase().isEmail().withMessage("email should be an email address!!"),
    (0, express_validator_1.body)("phoneNumber").trim().optional({ checkFalsy: true }).customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    (0, express_validator_1.body)("countryCode").trim().optional({ checkFalsy: true }),
];
exports.fetchAppoinmentValidator = [
    (0, express_validator_1.query)("email").optional({ checkFalsy: true }).trim().toLowerCase().isEmail().withMessage("email should be an email address!!"),
    (0, express_validator_1.query)("page").optional({ checkFalsy: true }).isNumeric().withMessage('Page should be numeric!'),
    (0, express_validator_1.query)("limit").optional({ checkFalsy: true }).isNumeric().withMessage('Limit should be numeric!'),
    (0, express_validator_1.query)("search").optional({ checkFalsy: true }),
];
