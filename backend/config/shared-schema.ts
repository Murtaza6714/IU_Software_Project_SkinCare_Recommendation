// import * as dynamoose from "dynamoose";

export const DateTimeSchema = {
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
  }