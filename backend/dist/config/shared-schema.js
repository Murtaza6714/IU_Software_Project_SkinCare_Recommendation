"use strict";
// import * as dynamoose from "dynamoose";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeSchema = void 0;
exports.DateTimeSchema = {
    type: "object",
    properties: {
        day: { type: "integer" },
        month: { type: "integer" },
        year: { type: "integer" },
        hour: { type: "integer" },
        minute: { type: "integer" },
        datestamp: { type: "string" },
        timestamp: { type: "string" },
        mongoTimestamp: { type: "string" },
    },
};
