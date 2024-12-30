import { checkInputError } from "../../utils";
import { QuestionService } from "../../service/shared";
import { UserService } from "../../service/shared/user.service";


export const saveUser = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const response = await UserService.saveUser(req.body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const getUserQuestionDetails = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const userId = req.query.userId
    const response = await UserService.getUserQuestionDetails(userId);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const getUserById = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const userId = req.query.userId
    const response = await UserService.getUserById(userId);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};



export const login = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const body = req.body
    const response = await UserService.login(body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
