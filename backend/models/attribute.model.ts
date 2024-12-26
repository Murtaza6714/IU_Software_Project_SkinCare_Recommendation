import { collectionNames } from "../config";
import { arangoDb, createCollectionWithSchema } from "../utils";

// async function createCollectionWithSchema() {
//   const collection = arangoDb.collection(collectionNames.ATTRIBUTES);

//   const schema: any = {
//     rule: {
//       properties: {
//         name: { type: "string" },
//         sortOrder: { type: "integer" }
//       },
//       additionalProperties: false,
//     },
//     level: "strict",
//     message: "Schema validation failed",
//   };
//   const exists = await collection.exists();
//   if (!exists) {
//     await arangoDb.createCollection(collectionNames.ATTRIBUTES, { schema });
//     console.log(`Collection ${collectionNames.ATTRIBUTES} with schema created.`);
//   } 
// }
  const schema: any = {
    rule: {
      properties: {
        name: { type: "string" },
        sortOrder: { type: "integer" }
      },
      additionalProperties: false,
    },
    level: "strict",
    message: "Schema validation failed",
  }; 
createCollectionWithSchema(collectionNames.ATTRIBUTES, schema).catch(console.error);
