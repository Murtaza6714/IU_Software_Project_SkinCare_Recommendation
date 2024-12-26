import { collectionNames, questionOptionType } from "../config";
import { DateTimeSchema } from "../config/shared-schema";
import { arangoDb, createCollectionWithSchema } from "../utils";

const schema: any = {
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
       dateTime: DateTimeSchema
    },
    additionalProperties: false,
  },
  level: "strict",
  message: "Schema validation failed",
};
createCollectionWithSchema(collectionNames.PRODUCT_RECOMMENDATION, schema).catch(console.error);
