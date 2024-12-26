import { checkInputError } from "../../utils";
import { QuestionService } from "../../service/shared";


export const getOnboardingQuestions = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const response = await QuestionService.getOnboardingQuestions();
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const saveOnboardingQuestions = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const userId = req.userId
    const body = req.body
    const response = await QuestionService.saveOnboardingQuestions(userId, body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};