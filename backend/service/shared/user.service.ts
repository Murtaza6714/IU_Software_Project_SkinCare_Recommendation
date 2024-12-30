import Services from "./services"
import { Apis, arangoDb, generateRandom, getDateTimeForToday, uploadBase64ImageToS3 } from "../../utils"
import { logger } from '../../utils'
import HttpStatus from "../../config/http-status"
import { getRedisValue, removeRedisValue, setRedisValue } from "../../middlewares/redis-communication"
import { collectionNames, companyEmail, companyName, defaultOtpExpiry, errorMessages } from "../../config"
import { aql } from 'arangojs'
import { log } from "winston"
import httpStatus from "../../config/http-status"
// import dynamoDb from "../../utils/database"
class UserServiceClass extends Services {

  async saveUser(body: any) {
    try {
      logger.info('Save user started for %s', body.phoneNumber);
      const assignedTo = body.assignedTo ? body.assignedTo : ""
      const cursor = await arangoDb.query({ query: `
      FOR user IN ${collectionNames.USERS}
      FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @phoneNumber
      RETURN user
    `, bindVars: { phoneNumber: body.phoneNumber  } })
    body.onBoardingQuestions.forEach((q: any) => {
      q.dateTime = getDateTimeForToday()
    })
    const otpData = {
      otp: generateRandom(),
      to: body.phoneNumber,
      action: "otpVerifyLogin",
      type: "BOTH"
    }
      let user: any = await cursor.next()
      
      if(user) {
        user.isOtpVerified = false
        const updatedUser = { ...user, name: body.name, email: body.email, countryCode: body.countryCode, onBoardingQuestions: body.onBoardingQuestions, createdDate: getDateTimeForToday(), assignedTo }
        const result = await arangoDb.query({
          query: `
            UPDATE @key WITH @updatedUser IN ${collectionNames.USERS}
            RETURN NEW
          `,
          bindVars: {
            key: user._key,
            updatedUser: updatedUser
          }
        });
        const updaUser = await result.next()
        user = updaUser
      } else {
        let newUserData: any = {}
        body.createdDate = getDateTimeForToday()
        newUserData = { ...body, isOtpVerified: false, isPremiumCustomer: false, assignedTo }
        delete newUserData.isValidated;
        const result = await arangoDb.query({query: `
        INSERT @body INTO ${collectionNames.USERS}
        RETURN NEW
    `, bindVars: {body: newUserData} });
        const createdUser = await result.next();
        user = createdUser
      }
      logger.info('Save user completed for %s', body.phoneNumber);
      return this.success({ message: "Onboarding questions fetched successfully!!", statusCode: HttpStatus.ok, data: user })
    } catch (error) {
      logger.error(`Error in Save user for ${body.phoneNumber}`);
      throw error
    }
  }
  async login(body: any) {
    try {
      logger.info('Login user started for %s', body.input);
      const cursor = await arangoDb.query({ query: `
      FOR user IN ${collectionNames.USERS}
      FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @input 
      OR LOWER(user.email) == LOWER(@input)
      RETURN user
    `, bindVars: { input: body.input  } })
    
    let user: any = await cursor.next()
    const otpData = {
      otp: generateRandom(),
      to: body.input,
      action: "otpVerifyLogin",
      type: "BOTH"
    }
    
      logger.info('Login user completed for %s', body.input);
      return this.success({ message: "Otp sent to mobile number to verify!!", statusCode: HttpStatus.ok, data: user })
    } catch (error) {
      logger.error(`Error in Login user for ${body.input}`);
      console.log(error);
      
      throw error
    }
  }

  
  async getUserQuestionDetails(userId: any) {
    try {
      logger.info('Fetch user question responses started for %s', userId);
      const cursor = await arangoDb.query({ query: `
      FOR user IN ${collectionNames.USERS}
      FILTER user._id == @userId
      FOR questionRes in user.onBoardingQuestions
      LET question = DOCUMENT(questionRes.questionId)
      LET responses = (
      FOR resId in questionRes.responseId
      RETURN DOCUMENT(resId))
      SORT question.sortOrder ASC
      RETURN MERGE(question, { responses })
    `, bindVars: { userId  } })
    const questionsData = await cursor.all()
      logger.info('Fetch user question responses completed for %s', userId);
      return this.success({ message: "User question Responses fetched successfully!!", statusCode: HttpStatus.ok, data: questionsData })
    } catch (error) {
      logger.error(`Error in Get user questions for ${userId}`);
      throw error
    }
  }
  async getUserById(userId: any) {
    try {
      logger.info('Fetch user question responses started for %s', userId);
      const cursor = await arangoDb.query({ query: `
      FOR user IN ${collectionNames.USERS}
      FILTER user._id == @userId
      RETURN user
    `, bindVars: { userId  } })
      let userData = await cursor.next()
      const questionsData = await this.getUserQuestionDetails(userId)
      userData.onBoardingQuestions = questionsData.data
      logger.info('Fetch user question responses completed for %s', userId);
      return this.success({ message: "User question Responses fetched successfully!!", statusCode: HttpStatus.ok, data: userData })
    } catch (error) {
      logger.error(`Error in Get user questions for ${userId}`);
      throw error
    }
  }

  
}

export const UserService = new UserServiceClass
