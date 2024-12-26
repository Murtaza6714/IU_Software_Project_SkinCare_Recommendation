import { collectionNames } from "../config";
import { DateTimeSchema } from "../config/shared-schema";
import { arangoDb, createCollectionWithSchema } from "../utils";

const schema: any = {
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
            dateTime: DateTimeSchema,
          },
        },
      },
      assignedTo: { type: "string" },
      createdDate: DateTimeSchema
    },
    additionalProperties: false,
  },
  level: "strict",
  message: "Schema validation failed",
};
createCollectionWithSchema(collectionNames.USERS, schema).catch(console.error);
