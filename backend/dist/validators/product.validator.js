"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductAttributesValidator = exports.getProductByIdValidator = exports.getProductByFilterValidator = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
exports.getProductByFilterValidator = [
    (0, express_validator_1.query)("page").optional({ checkFalsy: true }).isNumeric().withMessage('Page should be numeric!'),
    (0, express_validator_1.query)("limit").optional({ checkFalsy: true }).isNumeric().withMessage('Limit should be numeric!'),
    (0, express_validator_1.query)("search").optional({ checkFalsy: true }).trim(),
    (0, express_validator_1.query)("catId").optional({ checkFalsy: true }).trim(),
];
exports.getProductByIdValidator = [
    (0, utils_1.queryNotEmpty)("productId").trim(),
];
exports.updateProductAttributesValidator = [
    (0, utils_1.bodyNotEmpty)("productId").trim(),
    (0, utils_1.bodyNotEmpty)("attributeIds").isArray().withMessage("attributeIds should be an array!!"),
];
