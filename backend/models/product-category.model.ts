import { collectionNames } from "../config";
import { arangoDb, createCollectionWithSchema, createEdgeCollectionWithSchema } from "../utils";


const schema: any = {
  rule: {
    properties: {
      title: { type: "string" },
      sortOrder: { type: "integer" }
    },
    additionalProperties: false,
  },
  level: "strict",
  message: "Schema validation failed",
};
createCollectionWithSchema(collectionNames.PRODUCT_CATEGORY, schema).catch(console.error);
