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
exports.UserService = void 0;
const services_1 = __importDefault(require("./services"));
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
const http_status_1 = __importDefault(require("../../config/http-status"));
const config_1 = require("../../config");
// import dynamoDb from "../../utils/database"
class UserServiceClass extends services_1.default {
    saveUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Save user started for %s', body.phoneNumber);
                const assignedTo = body.assignedTo ? body.assignedTo : "";
                const cursor = yield utils_1.arangoDb.query({ query: `
      FOR user IN ${config_1.collectionNames.USERS}
      FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @phoneNumber
      RETURN user
    `, bindVars: { phoneNumber: body.phoneNumber } });
                body.onBoardingQuestions.forEach((q) => {
                    q.dateTime = (0, utils_1.getDateTimeForToday)();
                });
                const otpData = {
                    otp: (0, utils_1.generateRandom)(),
                    to: body.phoneNumber,
                    action: "otpVerifyLogin",
                    type: "BOTH"
                };
                let user = yield cursor.next();
                if (user) {
                    user.isOtpVerified = false;
                    const updatedUser = Object.assign(Object.assign({}, user), { name: body.name, email: body.email, countryCode: body.countryCode, onBoardingQuestions: body.onBoardingQuestions, createdDate: (0, utils_1.getDateTimeForToday)(), assignedTo });
                    const result = yield utils_1.arangoDb.query({
                        query: `
            UPDATE @key WITH @updatedUser IN ${config_1.collectionNames.USERS}
            RETURN NEW
          `,
                        bindVars: {
                            key: user._key,
                            updatedUser: updatedUser
                        }
                    });
                    const updaUser = yield result.next();
                    user = updaUser;
                }
                else {
                    let newUserData = {};
                    body.createdDate = (0, utils_1.getDateTimeForToday)();
                    newUserData = Object.assign(Object.assign({}, body), { isOtpVerified: false, isPremiumCustomer: false, assignedTo });
                    delete newUserData.isValidated;
                    const result = yield utils_1.arangoDb.query({ query: `
        INSERT @body INTO ${config_1.collectionNames.USERS}
        RETURN NEW
    `, bindVars: { body: newUserData } });
                    const createdUser = yield result.next();
                    user = createdUser;
                }
                utils_2.logger.info('Save user completed for %s', body.phoneNumber);
                return this.success({ message: "User saved successfully!!", statusCode: http_status_1.default.ok, data: user });
            }
            catch (error) {
                utils_2.logger.error(`Error in Save user for ${body.phoneNumber}`);
                throw error;
            }
        });
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Login user started for %s', body.input);
                const cursor = yield utils_1.arangoDb.query({ query: `
      FOR user IN ${config_1.collectionNames.USERS}
      FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @input 
      OR LOWER(user.email) == LOWER(@input)
      RETURN user
    `, bindVars: { input: body.input } });
                let user = yield cursor.next();
                const otpData = {
                    otp: (0, utils_1.generateRandom)(),
                    to: body.input,
                    action: "otpVerifyLogin",
                    type: "BOTH"
                };
                utils_2.logger.info('Login user completed for %s', body.input);
                return this.success({ message: "Otp sent to mobile number to verify!!", statusCode: http_status_1.default.ok, data: user });
            }
            catch (error) {
                utils_2.logger.error(`Error in Login user for ${body.input}`);
                console.log(error);
                throw error;
            }
        });
    }
    getUserQuestionDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Fetch user question responses started for %s', userId);
                const cursor = yield utils_1.arangoDb.query({ query: `
      FOR user IN ${config_1.collectionNames.USERS}
      FILTER user._id == @userId
      FOR questionRes in user.onBoardingQuestions
      LET question = DOCUMENT(questionRes.questionId)
      LET responses = (
      FOR resId in questionRes.responseId
      RETURN DOCUMENT(resId))
      SORT question.sortOrder ASC
      RETURN MERGE(question, { responses })
    `, bindVars: { userId } });
                const questionsData = yield cursor.all();
                utils_2.logger.info('Fetch user question responses completed for %s', userId);
                return this.success({ message: "User question Responses fetched successfully!!", statusCode: http_status_1.default.ok, data: questionsData });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get user questions for ${userId}`);
                throw error;
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Fetch user question responses started for %s', userId);
                const cursor = yield utils_1.arangoDb.query({ query: `
      FOR user IN ${config_1.collectionNames.USERS}
      FILTER user._id == @userId
      RETURN user
    `, bindVars: { userId } });
                let userData = yield cursor.next();
                const questionsData = yield this.getUserQuestionDetails(userId);
                userData.onBoardingQuestions = questionsData.data;
                utils_2.logger.info('Fetch user question responses completed for %s', userId);
                return this.success({ message: "User question Responses fetched successfully!!", statusCode: http_status_1.default.ok, data: userData });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get user questions for ${userId}`);
                throw error;
            }
        });
    }
}
exports.UserService = new UserServiceClass;
