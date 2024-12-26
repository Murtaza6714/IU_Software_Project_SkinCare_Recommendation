"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const config_1 = require("../config");
const jwt = __importStar(require("jsonwebtoken"));
const utils_1 = require("../utils");
const redis_communication_1 = require("./redis-communication");
const checkPermission = (resource, action) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let decodedToken;
            const authHeader = req.get("Authorization");
            if (!authHeader) {
                const error = new Error("Not authorized");
                error.statusCode = 401;
                throw error;
            }
            const token = authHeader.split(" ")[1];
            try {
                decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            }
            catch (err) {
                err.statusCode = 401;
                throw err;
            }
            if (!decodedToken) {
                const error = new Error("Not Authenticated");
                error.statusCode = 401;
                throw error;
            }
            let admin = null;
            const adminQuery = `
      FOR admin IN ${config_1.collectionNames.ADMIN}
      FILTER admin._id == @adminId
      RETURN admin
      `;
            const cacheKey = `${config_1.collectionNames.ADMIN}:${config_1.redisListType.GET_ONE}:${decodedToken._id}`;
            const redisData = yield (0, redis_communication_1.getRedisValue)(cacheKey);
            if (redisData)
                admin = redisData;
            else {
                const cursor = yield utils_1.arangoDb.query({ query: adminQuery, bindVars: { adminId: decodedToken._id } });
                admin = yield cursor.next();
                yield (0, redis_communication_1.setRedisValue)(cacheKey, config_1.redisTtl.ADMIN, admin);
            }
            if (!admin) {
                const error = new Error("Admin not found!!");
                error.statusCode = 401;
                throw error;
            }
            if (admin.role === config_1.adminRoles.SUPER_ADMIN) {
                req.user = admin;
                return next();
            }
            const hasPermission = admin.permissions.find((a) => a.resourceName === resource && a.action.includes(action));
            if (!hasPermission) {
                const error = new Error(`Permission denied to access ${resource} resource!!`);
                error.statusCode = 401;
                throw error;
            }
            req.user = admin;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.checkPermission = checkPermission;
