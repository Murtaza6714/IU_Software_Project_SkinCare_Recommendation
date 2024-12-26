"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const utils_1 = require("../utils");
const schema = {
    rule: {
        properties: {
            title: { type: "string" },
            sortOrder: { type: "integer" }
        },
        additionalProperties: false,
    },
    level: "strict",
    message: "Schema validation failed",
};
(0, utils_1.createCollectionWithSchema)(config_1.collectionNames.PRODUCT_CATEGORY, schema).catch(console.error);
