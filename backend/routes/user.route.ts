import { Router } from "express";
import { UserController } from "../controllers/shared"
import {  loginValidator, saveUserValidator } from "../validators/user.validator";
const router: Router = Router();


router.post("/save",saveUserValidator , UserController.saveUser);
router.post("/login",loginValidator , UserController.login);
router.get("/get-by-id", UserController.getUserById);
router.get("/get", UserController.getUserById);
router.get("/get-question-responses", UserController.getUserQuestionDetails);
 
export default router;