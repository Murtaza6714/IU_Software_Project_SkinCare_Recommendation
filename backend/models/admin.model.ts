import { adminRoleActionEnum, adminRoles, collectionNames, resourceNameEnum } from "../config";
import { DateTimeSchema } from "../config/shared-schema";
import { arangoDb, createCollectionWithSchema } from "../utils";

const schema: any = {
  rule: {
    type: "object",
    properties: {
      name: { type: "string" },
      username: { type: "string" },
      password: { type: "string" },
      role: { 
        type: "string",
        enum: Object.values(adminRoles)
      },
      createdDate: DateTimeSchema,
      permissions: { 
        type: "array",
        items: { 
          type: "object",
          properties: {
            resourceName: { type: "string", enum: Object.values(resourceNameEnum) }, 
            action: { type: "array", items: { type: "string", enum: Object.values(adminRoleActionEnum) } }
          }
        } 
      },
    },
    additionalProperties: false,
  },
  level: "strict",
  message: "Schema validation failed",
};
createCollectionWithSchema(collectionNames.ADMIN, schema).catch(console.error);
