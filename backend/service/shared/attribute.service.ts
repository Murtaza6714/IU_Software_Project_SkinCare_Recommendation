import Services from "./services"
import { Apis, arangoDb, comparePassword, generateRandom, generateToken, getDateTimeForToday, hashPassword, uploadBase64ImageToS3 } from "../../utils"
import { logger } from '../../utils'
import HttpStatus from "../../config/http-status"
import { getRedisValue, removeRedisValue, setRedisValue } from "../../middlewares/redis-communication"
import { collectionNames, defaultOtpExpiry, errorMessages } from "../../config"
import { aql } from 'arangojs'
import { log } from "winston"
import httpStatus from "../../config/http-status"
import { bgBlack } from "colorette"
// import dynamoDb from "../../utils/database"
class AttributeServiceClass extends Services {

  async fetch() {
    try {
      logger.info('Fetch attributes started for %s', );
      const cursor = await arangoDb.query(`
        FOR attribute IN ${collectionNames.ATTRIBUTES}
        RETURN attribute
      `)
      let attributes = await cursor.all()
     
      logger.info('Fetch attributes completed for %s', );
      return this.success({ message: "Attribute fetched successfully!!", data: attributes })
    } catch (error) {
      logger.error(`Error in Fetch attributes`);
      throw error
    }
  }

}

export const AttributeService = new AttributeServiceClass
