import { checkInputError } from "../../utils";
import { AttributeService } from "../../service/shared";


export const fetchAttribute = async (req: any, res: any, next: any) => {
  try {
    checkInputError(req);
    const response = await AttributeService.fetch();
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
