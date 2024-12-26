import { Router } from "express";
import { ProductController, QuestionController } from "../controllers/shared"
import { getProductByFilterValidator, getProductByIdValidator, updateProductAttributesValidator } from "../validators/product.validator";
const router: Router = Router();


router.get("/get-product-categories", ProductController.getProductCategories);
router.get("/fetch-by-filter",getProductByFilterValidator, ProductController.getProductByFilter);
router.get("/fetch-by-id",getProductByIdValidator, ProductController.getProductById);
router.patch("/update", ProductController.updateProduct);
router.patch("/update-attributes",updateProductAttributesValidator, ProductController.updateProductAttributes);

 
export default router;