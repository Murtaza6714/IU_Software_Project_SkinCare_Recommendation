import { checkInputError } from "../../utils";
import { SharedService } from "../../service/shared";


export const getPing = async (req: any, res: any, next: any) => {
  try {
    // Enable the below function to implement validation checks
    // checkInputError(req);
    const response = await SharedService.getPing();
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const recommendProduct = async (req: any, res: any, next: any) => {
  try {
    // Enable the below function to implement validation checks
    // checkInputError(req);
    const userId = req.query.userId 
    const body = req.body
    const response = await SharedService.recommendProduct(userId, body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const recommendSkinCare = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const body = req.body
    const response = await SharedService.recommendSkinCare(body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const getSignedUrl = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const body = req.body
    const response = await SharedService.getSignedUrlToPutObject(body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const getSignedUrlToViewObject = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const body = req.body
    const response = await SharedService.getSignedUrlToViewObject(body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const fetchRecommendationsById = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const userId = req.query.userId
    const productRecommendationId = req.query.productRecommendationId
    
    const response = await SharedService.fetchRecommendationsById(userId, productRecommendationId);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const fetchLatestRecommendationByFilter = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const response = await SharedService.fetchLatestRecommendationByFilter(req.body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const fetchRecommendations = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const body = req.body
    const query = {
      ...req.query,
      page: req.pageNo,
      limit: req.pageSize,
      skip: req.skipItem,
      searchText: req.searchText
    }
    const response = await SharedService.fetchRecommendations(query);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
