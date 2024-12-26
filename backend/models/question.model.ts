import { collectionNames, questionOptionType } from "../config";
import { arangoDb, createCollectionWithSchema } from "../utils";

const schema: any = {
  rule: {
    properties: {
      value: { type: "string" },
      hint: { type: "string" },
      questionType: { type: "string", enum: [ questionOptionType.TEXT ] },
      questionCategory: { type: "string" },
      responseType: { type: "string", enum: [ questionOptionType.TEXT, questionOptionType.MULTIPLE_SELECTION, questionOptionType.SINGLE_SELECTION, questionOptionType.RATING ] },
      sortOrder: { type : "integer"}
    },
    additionalProperties: false,
  },
  level: "strict",
  message: "Schema validation failed",
};
createCollectionWithSchema(collectionNames.QUESTIONS, schema).catch(console.error);
