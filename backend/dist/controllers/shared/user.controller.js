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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserAnalytics = exports.fetchUsers = exports.updateUser = exports.sendOtp = exports.login = exports.verifyOtp = exports.getUserByFilter = exports.getUserById = exports.getUserQuestionDetails = exports.saveUser = void 0;
const utils_1 = require("../../utils");
const user_service_1 = require("../../service/shared/user.service");
const saveUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const response = yield user_service_1.UserService.saveUser(req.body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.saveUser = saveUser;
const getUserQuestionDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const userId = req.query.userId;
        const response = yield user_service_1.UserService.getUserQuestionDetails(userId);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserQuestionDetails = getUserQuestionDetails;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const userId = req.query.userId;
        const response = yield user_service_1.UserService.getUserById(userId);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserById = getUserById;
const getUserByFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const userId = req.query.userId;
        const response = yield user_service_1.UserService.getUserByFilter(userId);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserByFilter = getUserByFilter;
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const body = req.body;
        const response = yield user_service_1.UserService.verifyOtp(body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOtp = verifyOtp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const body = req.body;
        const response = yield user_service_1.UserService.login(body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const body = req.body;
        const response = yield user_service_1.UserService.sendOtp(body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.sendOtp = sendOtp;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const body = req.body;
        const userId = req.query.userId;
        const response = yield user_service_1.UserService.updateUser(userId, body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const fetchUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const query = Object.assign(Object.assign({}, req.query), { page: req.pageNo, limit: req.pageSize, skip: req.skipItem, searchText: req.searchText });
        const response = yield user_service_1.UserService.findUsersByFilter(query);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchUsers = fetchUsers;
const fetchUserAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_service_1.UserService.fetchUserAnalytics();
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchUserAnalytics = fetchUserAnalytics;
