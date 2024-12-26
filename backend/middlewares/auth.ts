import { Request, Response, NextFunction } from "express";
import { adminRoles, collectionNames, redisListType, redisTtl } from "../config"; 
import * as jwt from "jsonwebtoken";
import { arangoDb } from "../utils";
import { getRedisValue, setRedisValue } from "./redis-communication";

export const checkPermission = (resource: string, action: string) => {
  return async (req: any, res: any, next: NextFunction) => {
    try {
      let decodedToken: any;
      const authHeader = req.get("Authorization");

      if (!authHeader) {
        const error: any = new Error("Not authorized");
        error.statusCode = 401;
        throw error;
      }
      const token = authHeader.split(" ")[1];
      try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
      } catch (err: any) {
        err.statusCode = 401;
        throw err;
      }

      if (!decodedToken) {
        const error: any = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
      }
      let admin: any = null
      const adminQuery = `
      FOR admin IN ${collectionNames.ADMIN}
      FILTER admin._id == @adminId
      RETURN admin
      `
      const cacheKey = `${collectionNames.ADMIN}:${redisListType.GET_ONE}:${decodedToken._id}`
      const redisData = await getRedisValue(cacheKey)
      if(redisData) admin = redisData
      else {
        const cursor = await arangoDb.query({ query: adminQuery, bindVars: { adminId: decodedToken._id  } })
        admin = await cursor.next()
        await setRedisValue(cacheKey, redisTtl.ADMIN, admin)
      }
      
      if(!admin) {
        const error: any = new Error("Admin not found!!");
        error.statusCode = 401;
        throw error;
      }
      if (admin.role === adminRoles.SUPER_ADMIN) {
        req.user = admin
        return next();
      }

      const hasPermission = admin.permissions.find((a: any) => a.resourceName === resource && a.action.includes(action))

      if (!hasPermission) {
        const error: any = new Error(`Permission denied to access ${resource} resource!!`);
        error.statusCode = 401;
        throw error;
      }
      req.user = admin
      next();
    } catch (error) {
      next(error)
    }
  };
};
