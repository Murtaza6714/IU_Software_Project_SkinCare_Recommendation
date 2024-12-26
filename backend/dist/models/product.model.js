"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const utils_1 = require("../utils");
const schema = {
    rule: {
        properties: {
            name: { type: "string" },
            retailPrice: { type: "integer" },
            productUse: { type: "string" },
            productBenefits: { type: "string" },
            application: { type: "string" },
            productType: { type: "string" },
            shopifyUrl: { type: "string" },
            ageGroup: {
                type: "array",
                items: {
                    type: "string",
                    enum: Object.values(config_1.ageGroupEnum)
                }
            },
            images: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        url: { type: "string" },
                        tag: { type: "string" }
                    }
                }
            },
            skinTypes: {
                type: "array",
                items: {
                    type: "string",
                    enum: ["DRY_SKIN", "NORMAL_SKIN", "COMBINATION_SKIN", "OILY_SKIN", "SENSITIVE_SKIN"]
                }
            }
        },
        required: ["name"],
        additionalProperties: false,
    },
    level: "strict",
    message: "Schema validation failed",
};
(0, utils_1.createCollectionWithSchema)(config_1.collectionNames.PRODUCTS, schema).catch(console.error);
