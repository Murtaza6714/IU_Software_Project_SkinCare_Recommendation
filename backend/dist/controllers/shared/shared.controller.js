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
exports.fetchRecommendations = exports.fetchLatestRecommendationByFilter = exports.fetchRecommendationsById = exports.getSignedUrlToViewObject = exports.getSignedUrl = exports.recommendSkinCare = exports.recommendProduct = exports.getPing = void 0;
const utils_1 = require("../../utils");
const shared_1 = require("../../service/shared");
const getPing = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Enable the below function to implement validation checks
        // checkInputError(req);
        const response = yield shared_1.SharedService.getPing();
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getPing = getPing;
const recommendProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Enable the below function to implement validation checks
        // checkInputError(req);
        const userId = req.query.userId;
        const body = req.body;
        const response = yield shared_1.SharedService.recommendProduct(userId, body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.recommendProduct = recommendProduct;
const recommendSkinCare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const body = req.body;
        const response = yield shared_1.SharedService.recommendSkinCare(body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.recommendSkinCare = recommendSkinCare;
const getSignedUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const body = req.body;
        const response = yield shared_1.SharedService.getSignedUrlToPutObject(body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getSignedUrl = getSignedUrl;
const getSignedUrlToViewObject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const body = req.body;
        const response = yield shared_1.SharedService.getSignedUrlToViewObject(body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getSignedUrlToViewObject = getSignedUrlToViewObject;
const fetchRecommendationsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const userId = req.query.userId;
        const productRecommendationId = req.query.productRecommendationId;
        const response = yield shared_1.SharedService.fetchRecommendationsById(userId, productRecommendationId);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchRecommendationsById = fetchRecommendationsById;
const fetchLatestRecommendationByFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const response = yield shared_1.SharedService.fetchLatestRecommendationByFilter(req.body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchLatestRecommendationByFilter = fetchLatestRecommendationByFilter;
const fetchRecommendations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const body = req.body;
        const query = Object.assign(Object.assign({}, req.query), { page: req.pageNo, limit: req.pageSize, skip: req.skipItem, searchText: req.searchText });
        const response = yield shared_1.SharedService.fetchRecommendations(query);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchRecommendations = fetchRecommendations;
