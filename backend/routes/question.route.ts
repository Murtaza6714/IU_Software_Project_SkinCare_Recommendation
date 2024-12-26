import { Router } from "express";
import { QuestionController } from "../controllers/shared"
const router: Router = Router();


router.get("/get-onboarding-questions", QuestionController.getOnboardingQuestions);
router.get("/save-onboarding-questions", QuestionController.saveOnboardingQuestions);

 
export default router;