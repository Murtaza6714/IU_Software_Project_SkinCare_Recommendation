import { Router } from "express";
import { AttributeController } from "../controllers/shared"
const router: Router = Router();


router.get("/fetch", AttributeController.fetchAttribute);

 
export default router;