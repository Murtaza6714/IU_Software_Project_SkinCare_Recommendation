"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const utils_1 = require("../utils");
const schema = {
    rule: {
        properties: {
            "_from": { type: "string" },
            "_to": { type: "string" },
        },
        additionalProperties: false,
    },
    level: "strict",
    message: "Schema validation failed",
};
(0, utils_1.createEdgeCollectionWithSchema)(config_1.collectionNames.QUESTION_OPTIONS, schema).catch(console.error);
