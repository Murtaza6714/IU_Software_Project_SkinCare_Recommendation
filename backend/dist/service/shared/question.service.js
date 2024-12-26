"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const services_1 = __importDefault(require("./services"));
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
const http_status_1 = __importDefault(require("../../config/http-status"));
const config_1 = require("../../config");
// import dynamoDb from "../../utils/database"
class QuestionServiceClass extends services_1.default {
    getOnboardingQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Get onboarding questions started for');
                const questionData = yield utils_1.arangoDb.query(`
      WITH ${config_1.collectionNames.OPTIONS}
      FOR question IN ${config_1.collectionNames.QUESTIONS}
      FILTER question.questionCategory == "onboardingQuestions"
      FOR option IN 1..1 OUTBOUND question ${config_1.collectionNames.QUESTION_OPTIONS}
      SORT option.sortOrder ASC
      COLLECT questions = question INTO options = option
      SORT questions.sortOrder ASC
      RETURN MERGE(questions, { options: options[*] })
    `);
                const da = yield questionData.all();
                utils_2.logger.info('Get onboarding questions completed');
                return this.success({ message: "Onboarding questions fetched successfully!!", statusCode: http_status_1.default.ok, data: da });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get onboarding questions`);
                throw error;
            }
        });
    }
    saveOnboardingQuestions(userId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Get onboarding questions started for');
                const questionData = yield utils_1.arangoDb.query(`
      FOR question IN ${config_1.collectionNames.QUESTIONS}
      FILTER question.questionCategory == "onboardingQuestions"
      FOR option IN 1..1 OUTBOUND question ${config_1.collectionNames.QUESTION_OPTIONS}
      SORT option.sortOrder ASC
      COLLECT questions = question INTO options = option
      SORT questions.sortOrder ASC
      RETURN MERGE(questions, { options: options[*] })
    `);
                const da = yield questionData.all();
                utils_2.logger.info('Get onboarding questions completed');
                return this.success({ message: "Onboarding questions fetched successfully!!", statusCode: http_status_1.default.ok, data: da });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get onboarding questions`);
                throw error;
            }
        });
    }
}
exports.QuestionService = new QuestionServiceClass;
