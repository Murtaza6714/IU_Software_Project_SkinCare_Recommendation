import { ageGroupEnum, collectionNames } from "../config";
import { arangoDb, createCollectionWithSchema } from "../utils";


const schema: any = {
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
          enum: Object.values(ageGroupEnum)
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
createCollectionWithSchema(collectionNames.PRODUCTS, schema).catch(console.error);
