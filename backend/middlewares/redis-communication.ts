// const redisClient = require("../configs/redis.js");

export const getRedisValue = async (key: string) => {
    const value = await globalThis.redisClient.get(key);
    try {
      const parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (error) {
      return value;
    }
}

export const setRedisValue = async (key: string, time: number, result: any) => {
    const value = await globalThis.redisClient.setEx(key, time, JSON.stringify(result));
    return value
}

export const removeRedisValue = async (keys: string[]) => {
  await globalThis.redisClient.del(keys);
};

export const deleteCache = async (
  collectionName: string,
  redisListType: string | undefined = undefined
): Promise<void> => {
  let pattern
  if(redisListType) pattern = `${collectionName}:${redisListType}:*`
  else pattern = `${collectionName}:*`
  
  const batchSize = 100;
  let cursor = 0;
  do {
  const result = await globalThis.redisClient.SCAN(cursor, "MATCH", pattern, "COUNT", batchSize);
  
  cursor = result.cursor;
  let keys = result.keys;
  keys = keys.filter((key: string) => key.startsWith(`${collectionName}:`));
  if (keys.length > 0) {
    // redisClient.del(keys)
    removeRedisValue(keys)
    // console.log(`Deleted keys: ${keys.join(", ")}`);
  }
} while (cursor !== 0);  // Continue until the cursor returns to "0"

  // console.log(`All cache keys matching pattern '${pattern}' deleted.`);
};