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
const redis_communication_1 = require("../../middlewares/redis-communication");
const config_1 = require("../../config");
const http_status_2 = __importDefault(require("../../config/http-status"));
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
                return this.success({ message: "Onboarding questions fetched successfully!!", statusCode: http_status_1.default.ok, data: user });
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
    getUserByFilter(userId) {
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
    verifyOtp(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Send otp Started for %s', body.input);
                // body.input = JSON.stringify(body.input)
                const cursor = yield utils_1.arangoDb.query({ query: `
        FOR user IN ${config_1.collectionNames.USERS}
        FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @input 
        OR LOWER(user.email) == LOWER(@input)
        RETURN user
      `, bindVars: { input: body.input } });
                let user = yield cursor.next();
                let to = body.input;
                if (user) {
                    user.phoneNumber = user.phoneNumber.replace(/\s+/g, "");
                    to = user.phoneNumber + user.email;
                }
                const otpData = yield (0, redis_communication_1.getRedisValue)(to);
                if (!otpData)
                    throw this.fail({ message: "Either otp generated or expired!!", statusCode: http_status_2.default.not_found });
                console.log(otpData);
                if (otpData.action !== body.action || otpData.otp.toString() !== body.otp.toString())
                    throw this.fail({ message: "Invalid Otp", statusCode: http_status_2.default.forbidden });
                yield (0, redis_communication_1.removeRedisValue)(to);
                utils_2.logger.info('Verify Otp Completed for %s', body.input);
                return this.success({ statusCode: http_status_2.default.ok, message: "OTP verified successfully!!" });
            }
            catch (error) {
                utils_2.logger.error(`Verify otp failed for %s`, body.input);
                throw (error);
            }
        });
    }
    sendOtp(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Send otp Started for %s', body.input);
                let otp = undefined;
                const cursor = yield utils_1.arangoDb.query({ query: `
      FOR user IN ${config_1.collectionNames.USERS}
      FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @input 
      OR LOWER(user.email) == (@input)
      RETURN user
    `, bindVars: { input: body.input } });
                let user = yield cursor.next();
                let to = body.input;
                if (user) {
                    user.phoneNumber = user.phoneNumber.replace(/\s+/g, "");
                    to = user.phoneNumber + user.email;
                }
                const otpData = yield (0, redis_communication_1.getRedisValue)(to);
                body.input = JSON.stringify(body.input);
                if (otpData && otpData.action === body.action) {
                    otp = otpData.otp;
                }
                else {
                    const newotp = (0, utils_1.generateRandom)();
                    const result = {
                        to,
                        otp: newotp,
                        action: body.action,
                        type: "BOTH", // SMS for now but can be email in future as well
                    };
                    otp = newotp;
                    yield (0, redis_communication_1.setRedisValue)(to, config_1.defaultOtpExpiry, result);
                }
                utils_2.logger.info('Send Otp Completed for %s', body.input);
                return this.success({ statusCode: http_status_2.default.ok, message: "Otp sent SuccessFully!!" });
            }
            catch (error) {
                utils_2.logger.error(`Send otp failed for %s`, body.input);
                throw (error);
            }
        });
    }
    updateUser(userId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Update user Started for %s', userId);
                const userModel = utils_1.arangoDb.collection(config_1.collectionNames.USERS);
                const user = yield userModel.document(userId);
                if (!user)
                    throw this.fail({ message: config_1.errorMessages.USER_NOT_FOUND, statusCode: http_status_2.default.not_found });
                const updatePayload = {};
                updatePayload.isPremiumCustomer = body.isPremiumCustomer ? body.isPremiumCustomer : false;
                const updatedUser = yield userModel.update(userId, updatePayload, { returnNew: true });
                if (body.isPremiumCustomer) {
                    let arangoQuery = `
        FOR Prod IN product_recommendation
        FILTER Prod.userId == @userId
        SORT Prod.dateTime DESC
        LIMIT 1
        RETURN Prod`;
                    const cursor = yield utils_1.arangoDb.query({
                        query: arangoQuery,
                        bindVars: { userId: user._id }
                    });
                    let data = yield cursor.next();
                    if (data) {
                        const publicUrl = data.publicUrl;
                        const subject = "Your recommendation has been Unlocked!!";
                    }
                }
                // if(data)
                // await sendLocalMessage({ contacts: [userId], msg: smsMessages.otpLogin })
                utils_2.logger.info('Update user Completed for %s', userId);
                return this.success({ statusCode: http_status_2.default.ok, message: "User updated successfully!!" });
            }
            catch (error) {
                utils_2.logger.error(`Update user failed for %s`, userId);
                throw (error);
            }
        });
    }
    findUsersByFilter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Find users by filter Started for %s');
                const arangoBindVars = { skip: query.skip, limit: query.limit };
                const countBindVars = {};
                let filters = [];
                if (query.email) {
                    filters.push(`user.email == @email`);
                    arangoBindVars.email = query.email;
                    countBindVars.email = query.email;
                }
                if (query.searchText) {
                    filters.push(`
          LIKE(user.email, CONCAT("%", @searchText, "%"), true) 
          OR 
          LIKE(SUBSTITUTE(user.phoneNumber, " ", ""), CONCAT("%", @searchText, "%"), true)`);
                    arangoBindVars.searchText = query.searchText;
                    countBindVars.searchText = query.searchText;
                }
                const result = yield utils_1.arangoDb.query({ query: `
        FOR user in ${config_1.collectionNames.USERS}
        ${filters.length > 0 ? `FILTER ${filters.join(' AND ')}` : ``}
        SORT user.createdDate.datestamp DESC
        LIMIT @skip, @limit
        return user
      `, bindVars: Object.assign({}, arangoBindVars) });
                let data = yield result.all();
                const countQuery = `
            RETURN LENGTH(
                (
                    FOR user IN ${config_1.collectionNames.USERS}
                    ${filters.length > 0 ? `FILTER ${filters.join(' AND ')}` : ''}
                    RETURN user
                )
            )
        `;
                const countResult = yield utils_1.arangoDb.query({ query: countQuery, bindVars: Object.assign({}, countBindVars) });
                const totalCounts = yield countResult.next();
                utils_2.logger.info('Find users by filter Completed for %s');
                return this.success({ message: "User fetched successfully!!", data, totalCounts });
            }
            catch (error) {
                utils_2.logger.error(`Find users by filter failed for %s`);
                throw (error);
            }
        });
    }
    fetchUserAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Fetch user analytics Started for %s');
                const result = yield utils_1.arangoDb.query(`
        LET usersPerWeek = (
        FOR user IN ${config_1.collectionNames.USERS}
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
                let data = yield result.all();
                utils_2.logger.info('Fetch user analytics Completed for %s');
                return this.success({ message: "User analytics successfully!!", data });
            }
            catch (error) {
                utils_2.logger.error(`Fetch user analytics failed for %s`);
                throw (error);
            }
        });
    }
}
exports.UserService = new UserServiceClass;
