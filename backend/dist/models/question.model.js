"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const utils_1 = require("../utils");
const schema = {
    rule: {
        properties: {
            value: { type: "string" },
            hint: { type: "string" },
            questionType: { type: "string", enum: [config_1.questionOptionType.TEXT] },
            questionCategory: { type: "string" },
            responseType: { type: "string", enum: [config_1.questionOptionType.TEXT, config_1.questionOptionType.MULTIPLE_SELECTION, config_1.questionOptionType.SINGLE_SELECTION, config_1.questionOptionType.RATING] },
            sortOrder: { type: "integer" }
        },
        additionalProperties: false,
    },
    level: "strict",
    message: "Schema validation failed",
};
(0, utils_1.createCollectionWithSchema)(config_1.collectionNames.QUESTIONS, schema).catch(console.error);
