import { checkInputError } from "../../utils";
import { ProductService, QuestionService } from "../../service/shared";


export const getProductCategories = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const response = await ProductService.getProductCategories();
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const getProductByFilter = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const query = {
      ...req.query,
      page: req.pageNo,
      limit: req.pageSize,
      skip: req.skipItem,
      searchText: req.searchText
    }
    const response = await ProductService.getProductByFilter(query);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const getProductById = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const query = {
      ...req.query,
      page: req.pageNo,
      limit: req.pageSize,
      skip: req.skipItem,
      searchText: req.searchText
    }
    const response = await ProductService.getProductById(query);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: any, next: any) => {
  try {
    // checkInputError(req);
    const response = await ProductService.updateProduct(req.body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateProductAttributes = async (req: Request, res: any, next: any) => {
  try {
    checkInputError(req);
    const response = await ProductService.updateProductAttributes(req.body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};