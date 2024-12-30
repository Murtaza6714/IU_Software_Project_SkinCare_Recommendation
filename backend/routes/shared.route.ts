import { Router } from "express";
import * as SharedController from "../controllers/shared/shared.controller"
import { fetchLatestRecommendationByFilterValidator } from "../validators/shared.validator";
const router: Router = Router();


router.get("/ping", SharedController.getPing);
router.post("/recommend-product", SharedController.recommendProduct);
router.post("/recommend-skin-care", SharedController.recommendSkinCare);
router.get("/fetch-recommendations", SharedController.fetchRecommendations);
router.get("/fetch-recommendations-by-id", SharedController.fetchRecommendationsById);
router.post("/fetch-latest-recommendation-by-filter",fetchLatestRecommendationByFilterValidator, SharedController.fetchLatestRecommendationByFilter);
router.post("/get-signed-url-to-put-object", SharedController.getSignedUrl);
router.post("/get-signed-url-to-view-object", SharedController.getSignedUrlToViewObject);
 
export default router;