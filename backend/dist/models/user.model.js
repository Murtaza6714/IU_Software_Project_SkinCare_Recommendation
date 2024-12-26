"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const shared_schema_1 = require("../config/shared-schema");
const utils_1 = require("../utils");
const schema = {
    rule: {
        type: "object",
        properties: {
            name: { type: "string" },
            age: { type: "integer" },
            email: { type: "string" },
            phoneNumber: { type: "string" },
            countryCode: { type: "string" },
            isOtpVerified: { type: "boolean" },
            isPremiumCustomer: { type: "boolean" },
            onBoardingQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        questionId: { type: "string" },
                        responseId: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        dateTime: shared_schema_1.DateTimeSchema,
                    },
                },
            },
            assignedTo: { type: "string" },
            createdDate: shared_schema_1.DateTimeSchema
        },
        additionalProperties: false,
    },
    level: "strict",
    message: "Schema validation failed",
};
(0, utils_1.createCollectionWithSchema)(config_1.collectionNames.USERS, schema).catch(console.error);
