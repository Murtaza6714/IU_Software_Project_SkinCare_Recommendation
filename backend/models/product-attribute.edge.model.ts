import { collectionNames } from "../config";
import { arangoDb, createCollectionWithSchema, createEdgeCollectionWithSchema } from "../utils";


const schema: any = {
  rule: {
    properties: {
      "_from": { type: "string" },
      "_to": { type: "string" },
    },
    additionalProperties: false,
  },
  level: "strict",
  message: "Schema validation failed",
};
createEdgeCollectionWithSchema(collectionNames.PRODUCT_ATTRIBUTES, schema).catch(console.error);
