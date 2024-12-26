import { collectionNames, questionOptionType } from "../config";
import { arangoDb, createEdgeCollectionWithSchema } from "../utils";

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
createEdgeCollectionWithSchema(collectionNames.QUESTION_OPTIONS, schema).catch(console.error);
