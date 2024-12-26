"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const utils_1 = require("../utils");
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
const schema = {
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
(0, utils_1.createCollectionWithSchema)(config_1.collectionNames.ATTRIBUTES, schema).catch(console.error);
