"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLatestRecommendationByFilterValidator = void 0;
const utils_1 = require("../utils");
exports.fetchLatestRecommendationByFilterValidator = [
    (0, utils_1.bodyNotEmpty)("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
];
