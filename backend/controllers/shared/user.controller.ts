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
export const getUserByFilter = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const userId = req.query.userId
    const response = await UserService.getUserByFilter(userId);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const body = req.body
    const response = await UserService.verifyOtp(body);
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
export const sendOtp = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const body = req.body
    const response = await UserService.sendOtp(body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const body = req.body
    const userId = req.query.userId
    const response = await UserService.updateUser(userId,body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const fetchUsers = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const query = {
      ...req.query,
      page: req.pageNo,
      limit: req.pageSize,
      skip: req.skipItem,
      searchText: req.searchText
    }
    const response = await UserService.findUsersByFilter(query);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const fetchUserAnalytics = async (req: any, res: any, next: any) => {
  try {
    const response = await UserService.fetchUserAnalytics();
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
