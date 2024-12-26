import * as redis from "redis"
import { logger } from "./logger";


export default async function () {
    if(process.env.REDIS_HOST && process.env.REDIS_PORT) {
        // const client = redis.createClient({
        //     url: process.env.REDIS_URL
        // });

        const client = redis.createClient();

        try {
            await client.connect();
            logger.info("Connected to Redis Client!!")
    } catch (error) {
            console.log('Error while making connection to redis client: ', error);
            logger.error("Error while making connection to redis client:")
        }
    
        client.on('error', err => {
            console.log('Error while making connection to redis client: ', err);
            logger.error("Error while making connection to redis client:")
        });
    
        
        globalThis.redisClient = client;
    }
    
}
