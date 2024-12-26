"use strict";
// const redisClient = require("../configs/redis.js");
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
exports.deleteCache = exports.removeRedisValue = exports.setRedisValue = exports.getRedisValue = void 0;
const getRedisValue = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const value = yield globalThis.redisClient.get(key);
    try {
        const parsedValue = JSON.parse(value);
        return parsedValue;
    }
    catch (error) {
        return value;
    }
});
exports.getRedisValue = getRedisValue;
const setRedisValue = (key, time, result) => __awaiter(void 0, void 0, void 0, function* () {
    const value = yield globalThis.redisClient.setEx(key, time, JSON.stringify(result));
    return value;
});
exports.setRedisValue = setRedisValue;
const removeRedisValue = (keys) => __awaiter(void 0, void 0, void 0, function* () {
    yield globalThis.redisClient.del(keys);
});
exports.removeRedisValue = removeRedisValue;
const deleteCache = (collectionName_1, ...args_1) => __awaiter(void 0, [collectionName_1, ...args_1], void 0, function* (collectionName, redisListType = undefined) {
    let pattern;
    if (redisListType)
        pattern = `${collectionName}:${redisListType}:*`;
    else
        pattern = `${collectionName}:*`;
    const batchSize = 100;
    let cursor = 0;
    do {
        const result = yield globalThis.redisClient.SCAN(cursor, "MATCH", pattern, "COUNT", batchSize);
        cursor = result.cursor;
        let keys = result.keys;
        keys = keys.filter((key) => key.startsWith(`${collectionName}:`));
        if (keys.length > 0) {
            // redisClient.del(keys)
            (0, exports.removeRedisValue)(keys);
            // console.log(`Deleted keys: ${keys.join(", ")}`);
        }
    } while (cursor !== 0); // Continue until the cursor returns to "0"
    // console.log(`All cache keys matching pattern '${pattern}' deleted.`);
});
exports.deleteCache = deleteCache;
