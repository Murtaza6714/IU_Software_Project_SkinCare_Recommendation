import Services from "./services"
import { Apis, arangoDb, getDateTimeForToday, uploadBase64ImageToS3 } from "../../utils"
import { logger } from '../../utils'
import HttpStatus from "../../config/http-status"
import { getRedisValue, setRedisValue } from "../../middlewares/redis-communication"
import { collectionNames } from "../../config"
import { aql } from 'arangojs'
import { log } from "winston"
// import dynamoDb from "../../utils/database"
class QuestionServiceClass extends Services {

  async getOnboardingQuestions() {
    try {
      logger.info('Get onboarding questions started for');
      const questionData = await arangoDb.query(`
      WITH ${collectionNames.OPTIONS}
      FOR question IN ${collectionNames.QUESTIONS}
      FILTER question.questionCategory == "onboardingQuestions"
      FOR option IN 1..1 OUTBOUND question ${collectionNames.QUESTION_OPTIONS}
      SORT option.sortOrder ASC
      COLLECT questions = question INTO options = option
      SORT questions.sortOrder ASC
      RETURN MERGE(questions, { options: options[*] })
    `)
    
      const da = await questionData.all()
    
      logger.info('Get onboarding questions completed');
      return this.success({ message: "Onboarding questions fetched successfully!!", statusCode: HttpStatus.ok, data: da })
    } catch (error) {
      logger.error(`Error in Get onboarding questions`);
      throw error
    }
  }
  async saveOnboardingQuestions(userId: string, body: any) {
    try {
      logger.info('Get onboarding questions started for');
      const questionData = await arangoDb.query(`
      FOR question IN ${collectionNames.QUESTIONS}
      FILTER question.questionCategory == "onboardingQuestions"
      FOR option IN 1..1 OUTBOUND question ${collectionNames.QUESTION_OPTIONS}
      SORT option.sortOrder ASC
      COLLECT questions = question INTO options = option
      SORT questions.sortOrder ASC
      RETURN MERGE(questions, { options: options[*] })
    `)
    
      const da = await questionData.all()
    
      logger.info('Get onboarding questions completed');
      return this.success({ message: "Onboarding questions fetched successfully!!", statusCode: HttpStatus.ok, data: da })
    } catch (error) {
      logger.error(`Error in Get onboarding questions`);
      throw error
    }
  }

}

export const QuestionService = new QuestionServiceClass
