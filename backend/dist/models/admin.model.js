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
            username: { type: "string" },
            password: { type: "string" },
            role: {
                type: "string",
                enum: Object.values(config_1.adminRoles)
            },
            createdDate: shared_schema_1.DateTimeSchema,
            permissions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        resourceName: { type: "string", enum: Object.values(config_1.resourceNameEnum) },
                        action: { type: "array", items: { type: "string", enum: Object.values(config_1.adminRoleActionEnum) } }
                    }
                }
            },
        },
        additionalProperties: false,
    },
    level: "strict",
    message: "Schema validation failed",
};
(0, utils_1.createCollectionWithSchema)(config_1.collectionNames.ADMIN, schema).catch(console.error);
