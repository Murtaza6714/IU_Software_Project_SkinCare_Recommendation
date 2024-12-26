import { Router } from "express";
import { UserController } from "../controllers/shared"
import { fetchUserValidator, loginValidator, saveUserValidator, sendOtpValidator, verifyOtpValidator } from "../validators/user.validator";
const router: Router = Router();


router.post("/save",saveUserValidator , UserController.saveUser);
router.post("/login",loginValidator , UserController.login);
router.get("/get-by-id", UserController.getUserById);
router.get("/get", UserController.getUserById);
router.get("/get-question-responses", UserController.getUserQuestionDetails);
router.post("/verify-otp",verifyOtpValidator, UserController.verifyOtp);
router.post("/send-otp",sendOtpValidator , UserController.sendOtp)
 
export default router;