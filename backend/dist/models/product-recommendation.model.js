"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const shared_schema_1 = require("../config/shared-schema");
const utils_1 = require("../utils");
const schema = {
    rule: {
        properties: {
            userId: { type: "string" },
            publicUrl: { type: "string" },
            skinSummary: { type: "string" },
            dietPlanId: { type: "string" },
            skinType: {
                type: "string",
                enum: ["DRY_SKIN", "NORMAL_SKIN", "COMBINATION_SKIN", "OILY_SKIN", "SENSITIVE_SKIN"]
            },
            capturedImages: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        fileName: { type: "string" },
                        url: { type: "string" }
                    }
                }
            },
            analysedImages: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        fileName: { type: "string" },
                        url: { type: "string" }
                    }
                }
            },
            detectedAttributes: { type: "array", items: { type: "string" } },
            recommendedProducts: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        productCategoryId: { type: "string" },
                        products: { type: "array", items: {
                                type: "object",
                                properties: {
                                    productId: { type: "string" },
                                    matchesIds: { type: "array", items: { type: "string" } },
                                }
                            } },
                    }
                }
            },
            recommendedSalonServices: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        salonServiceId: { type: "string" },
                        matchingAttributes: { type: "array", items: { type: "string" } },
                        matchingCount: { type: "integer" }
                    }
                }
            },
            recommendedCosmeticServices: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        cosmeticServiceId: { type: "string" },
                        matchingAttributes: { type: "array", items: { type: "string" } },
                        matchingCount: { type: "integer" }
                    }
                }
            },
            recommendedProductBundles: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        productBundleId: { type: "string" },
                        matchingProducts: { type: "array", items: { type: "string" } },
                        matchingProductCount: { type: "integer" }
                    }
                }
            },
            attributeCode: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        attribute: { type: "string" },
                        code: { type: "string" },
                        confidence: { type: "integer" }
                    }
                }
            },
            dateTime: shared_schema_1.DateTimeSchema
        },
        additionalProperties: false,
    },
    level: "strict",
    message: "Schema validation failed",
};
(0, utils_1.createCollectionWithSchema)(config_1.collectionNames.PRODUCT_RECOMMENDATION, schema).catch(console.error);
