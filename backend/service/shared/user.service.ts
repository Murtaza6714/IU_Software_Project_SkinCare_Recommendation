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
  async getUserByFilter(userId: any) {
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

  async verifyOtp(body: any) {
    try {
      logger.info('Send otp Started for %s', body.input);
      // body.input = JSON.stringify(body.input)
      const cursor = await arangoDb.query({ query: `
        FOR user IN ${collectionNames.USERS}
        FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @input 
        OR LOWER(user.email) == LOWER(@input)
        RETURN user
      `, bindVars: { input: body.input } })
        let user = await cursor.next()
        let to = body.input
        if(user) {
          user.phoneNumber = user.phoneNumber.replace(/\s+/g, "");
          to = user.phoneNumber+user.email
        }
      const otpData = await getRedisValue(to)
      if (!otpData) throw this.fail({ message: "Either otp generated or expired!!", statusCode: httpStatus.not_found });
      console.log(otpData);

      if (otpData.action !== body.action || otpData.otp.toString() !== body.otp.toString()) throw this.fail({ message: "Invalid Otp", statusCode: httpStatus.forbidden });
      
      await removeRedisValue(to)
      logger.info('Verify Otp Completed for %s', body.input);
      return this.success({ statusCode: httpStatus.ok, message: "OTP verified successfully!!" });
    } catch (error) {
        logger.error(`Verify otp failed for %s`, body.input);
        throw (error)
    }
  }

  async sendOtp(body: any) {
    try {
      logger.info('Send otp Started for %s', body.input);
      let otp = undefined
      const cursor = await arangoDb.query({ query: `
      FOR user IN ${collectionNames.USERS}
      FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @input 
      OR LOWER(user.email) == (@input)
      RETURN user
    `, bindVars: { input: body.input } })
      let user = await cursor.next()
      let to = body.input
      if(user) {
        user.phoneNumber = user.phoneNumber.replace(/\s+/g, "");
        to =  user.phoneNumber+user.email
      }
      
      const otpData = await getRedisValue(to)
      body.input = JSON.stringify(body.input)
      if (otpData && otpData.action === body.action) {
        otp = otpData.otp;
      } else {
        const newotp = generateRandom();
        const result = {
          to,
          otp: newotp,
          action: body.action,
          type: "BOTH", // SMS for now but can be email in future as well
        };
        otp = newotp;
        await setRedisValue(to, defaultOtpExpiry, result);
      }
      logger.info('Send Otp Completed for %s', body.input);
      return this.success({ statusCode: httpStatus.ok, message: "Otp sent SuccessFully!!" });
    } catch (error) {
        logger.error(`Send otp failed for %s`, body.input);
        throw (error)
    }
  }
  async updateUser(userId: string, body: any) {
    try {
      logger.info('Update user Started for %s', userId);
      const userModel = arangoDb.collection(collectionNames.USERS)
      const user = await userModel.document(userId)
      
      if(!user) throw this.fail({ message: errorMessages.USER_NOT_FOUND, statusCode: httpStatus.not_found })
      const updatePayload: any = {} 
      updatePayload.isPremiumCustomer = body.isPremiumCustomer ? body.isPremiumCustomer : false
      const updatedUser = await userModel.update(userId, updatePayload, { returnNew: true })
      if(body.isPremiumCustomer) {
        let arangoQuery = `
        FOR Prod IN product_recommendation
        FILTER Prod.userId == @userId
        SORT Prod.dateTime DESC
        LIMIT 1
        RETURN Prod`
        const cursor = await arangoDb.query({
          query: arangoQuery,
          bindVars: { userId: user._id }
        })
        let data = await cursor.next()
        if(data) {
          const publicUrl = data.publicUrl
          const subject = "Your recommendation has been Unlocked!!"
        }
    }
      
      // if(data)
      // await sendLocalMessage({ contacts: [userId], msg: smsMessages.otpLogin })
      logger.info('Update user Completed for %s', userId);
      return this.success({ statusCode: httpStatus.ok, message: "User updated successfully!!" });
    } catch (error) {
        logger.error(`Update user failed for %s`, userId);
        throw (error)
    }
  }
  async findUsersByFilter(query: any) {
    try {
      logger.info('Find users by filter Started for %s');
      const arangoBindVars: any = { skip : query.skip, limit: query.limit }
      const countBindVars: any = {}
      let filters = [];
      if (query.email) {
        filters.push(`user.email == @email`);
        arangoBindVars.email = query.email
        countBindVars.email = query.email
      }
      if (query.searchText) {
        filters.push(`
          LIKE(user.email, CONCAT("%", @searchText, "%"), true) 
          OR 
          LIKE(SUBSTITUTE(user.phoneNumber, " ", ""), CONCAT("%", @searchText, "%"), true)`);
        arangoBindVars.searchText = query.searchText
        countBindVars.searchText = query.searchText
      }
      
      const result = await arangoDb.query({query: `
        FOR user in ${collectionNames.USERS}
        ${filters.length > 0 ? `FILTER ${filters.join(' AND ')}` : ``}
        SORT user.createdDate.datestamp DESC
        LIMIT @skip, @limit
        return user
      `, bindVars: {...arangoBindVars} });
      let data = await result.all()
      const countQuery = `
            RETURN LENGTH(
                (
                    FOR user IN ${collectionNames.USERS}
                    ${filters.length > 0 ? `FILTER ${filters.join(' AND ')}` : ''}
                    RETURN user
                )
            )
        `;
        
      const countResult = await arangoDb.query({ query: countQuery, bindVars: { ...countBindVars } });
      const totalCounts: any = await countResult.next();
      logger.info('Find users by filter Completed for %s');
      return this.success({ message: "User fetched successfully!!", data, totalCounts  });
    } catch (error) {
        logger.error(`Find users by filter failed for %s`);
        throw (error)
    }
  }
  async fetchUserAnalytics() {
    try {
      logger.info('Fetch user analytics Started for %s');
      const result = await arangoDb.query(`
        LET usersPerWeek = (
        FOR user IN ${collectionNames.USERS}
          LET createdDate = DATE_ISO8601(user.createdDate.timestamp)
          FILTER createdDate != null
          LET year = DATE_YEAR(createdDate)
          LET week = DATE_ISOWEEK(createdDate)
          LET month = DATE_MONTH(createdDate)
          LET monthName = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
          ][month - 1]
          FILTER year != null && week != null && month != null
          COLLECT years = year, weeks = week, months = monthName WITH COUNT INTO count
          RETURN { year: years, week: weeks, month: months, count }
        )

        LET usersPerMonth = (
          FOR user IN users
            LET createdDate = DATE_ISO8601(user.createdDate.timestamp)
            FILTER createdDate != null
            LET year = DATE_YEAR(createdDate)
            LET month = DATE_MONTH(createdDate)
            LET monthName = [
              "January", "February", "March", "April", "May", "June", 
              "July", "August", "September", "October", "November", "December"
            ][month - 1]
            FILTER year != null && month != null
            COLLECT years = year, months = monthName WITH COUNT INTO count
            RETURN { year: years, month: months, count }
        )

        LET totalUsersPerWeek = SUM(usersPerWeek[*].count)
        LET weeksCount = LENGTH(usersPerWeek)
        LET averageUsersPerWeek = ROUND(totalUsersPerWeek / weeksCount)

        LET totalUsersPerMonth = SUM(usersPerMonth[*].count)
        LET monthsCount = LENGTH(usersPerMonth)
        LET averageUsersPerMonth = ROUND(totalUsersPerMonth / monthsCount)
        LET userByAge = (
        FOR user IN users
          LET firstOnboardingQuestion = FIRST(user.onBoardingQuestions)
          LET responseId = FIRST(firstOnboardingQuestion.responseId)
          LET responseData = DOCUMENT(responseId)
          LET ageValue = responseData.value
          RETURN ageValue
        )

        LET ageGroups = (
          FOR age IN userByAge
            COLLECT ageCategory = age INTO groupedAge
            LET count = LENGTH(groupedAge)
            RETURN { ageCategory, count }
        )

        RETURN { 
          weeklyData: usersPerWeek, 
          monthlyData: usersPerMonth, 
          averageUsersPerWeek, 
          averageUsersPerMonth,
          ageGroups
        }
        `);
      let data = await result.all()
      logger.info('Fetch user analytics Completed for %s');
      return this.success({ message: "User analytics successfully!!", data  });
    } catch (error) {
        logger.error(`Fetch user analytics failed for %s`);
        throw (error)
    }
  }
}

export const UserService = new UserServiceClass
