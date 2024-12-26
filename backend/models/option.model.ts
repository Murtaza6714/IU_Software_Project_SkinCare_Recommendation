import { collectionNames, questionOptionType } from "../config";
import { arangoDb, createCollectionWithSchema } from "../utils";


const schema: any = {
  rule: {
    properties: {
      value: { type: "string" },
      label: { type: "string" },
      description: { type: "string" },
      questionId: { type: "string" },
      sortOrder: { type: "integer" },
    },
    additionalProperties: false,
  },
  level: "strict",
  message: "Schema validation failed",
};
createCollectionWithSchema(collectionNames.OPTIONS, schema).catch(console.error);
