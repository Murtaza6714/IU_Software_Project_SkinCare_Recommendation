"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shared_1 = require("../controllers/shared");
const router = (0, express_1.Router)();
router.get("/get-onboarding-questions", shared_1.QuestionController.getOnboardingQuestions);
router.get("/save-onboarding-questions", shared_1.QuestionController.saveOnboardingQuestions);
exports.default = router;
