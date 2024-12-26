import { Router } from "express";
import { AttributeController, ProductController, QuestionController } from "../controllers/shared"
import { getProductByFilterValidator } from "../validators/product.validator";
const router: Router = Router();


router.get("/fetch", AttributeController.fetchAttribute);

 
export default router;