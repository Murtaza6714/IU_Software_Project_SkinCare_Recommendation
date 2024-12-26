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
exports.saveOnboardingQuestions = exports.getOnboardingQuestions = void 0;
const shared_1 = require("../../service/shared");
const getOnboardingQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const response = yield shared_1.QuestionService.getOnboardingQuestions();
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getOnboardingQuestions = getOnboardingQuestions;
const saveOnboardingQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const userId = req.userId;
        const body = req.body;
        const response = yield shared_1.QuestionService.saveOnboardingQuestions(userId, body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.saveOnboardingQuestions = saveOnboardingQuestions;
