"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedService = void 0;
const services_1 = __importDefault(require("./services"));
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
const http_status_1 = __importDefault(require("../../config/http-status"));
const redis_communication_1 = require("../../middlewares/redis-communication");
const config_1 = require("../../config");
const bucket_upload_1 = require("../../middlewares/bucket-upload");
const user_service_1 = require("./user.service");
// import dynamoDb from "../../utils/database"
class SharedServiceClass extends services_1.default {
    getPing() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Get Ping started');
                const data = yield utils_1.arangoDb.query(`
      FOR prod IN ${config_1.collectionNames.PRODUCTS}
      FOR prodCAT IN 1..1 INBOUND prod ${config_1.collectionNames.PRODUCT_CATEGORY_PRODUCTS}
      COLLECT cat = prodCAT INTO matches = prod
      RETURN { cat, matches }   
    `);
                const dataa = utils_1.arangoDb.collection(config_1.collectionNames.PRODUCTS);
                const allCollections = yield utils_1.arangoDb.listCollections();
                // console.log(allCollections);
                const d = yield data.all();
                console.log(d);
                utils_2.logger.info('Get Ping completed');
                return this.success({ message: "Ping api ran successfully!!", statusCode: http_status_1.default.ok });
            }
            catch (error) {
                utils_2.logger.error(`Error in getting ping`);
                throw error;
            }
        });
    }
    recommendProduct(userId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Recommend product started for %s', userId);
                const attributes = JSON.stringify(body.attributes);
                let skinTypeQuery = "";
                let skinTypeBundleQuery = "";
                if (body.skinType) {
                    skinTypeQuery = `FILTER ${JSON.stringify(body.skinType)} IN product.skinTypes`;
                    skinTypeBundleQuery = `FILTER ${JSON.stringify(body.skinType)} IN bundle.skinTypes`;
                }
                const teenAgeString = JSON.stringify(config_1.ageGroupEnum.TEEN_UNDER_20);
                const data = yield utils_1.arangoDb.query(`
      WITH ${config_1.collectionNames.PRODUCTS}, ${config_1.collectionNames.PRODUCT_CATEGORY}
      FOR attribute IN ${config_1.collectionNames.ATTRIBUTES}
      FILTER attribute.name IN ${attributes}
      LET ageGroup = (
        FOR u IN ${config_1.collectionNames.USERS}
        FILTER u._id == ${JSON.stringify(userId)}
        LET response = DOCUMENT(u.onBoardingQuestions[0].responseId)
        RETURN response[0].value
      )
      FOR product IN 1..1 INBOUND attribute ${config_1.collectionNames.PRODUCT_ATTRIBUTES}
      ${skinTypeQuery ? skinTypeQuery : ``}
      // FILTER (ageGroup[0] == ${teenAgeString} && ageGroup[0] IN product.ageGroup) || ageGroup[0] != ${teenAgeString}
      COLLECT products = product INTO matches = attribute
      LET productMatch = matches[*]
      LET matchCount = LENGTH(matches)
      SORT matchCount DESC
      FOR product_category IN 1..1 INBOUND products ${config_1.collectionNames.PRODUCT_CATEGORY_PRODUCTS}
      COLLECT productCategories = product_category INTO finalProducts = {products: products, matches: productMatch }
      SORT productCategories.sortOrder ASC
      LET limitedFinalProducts = (
        FOR item IN finalProducts
        LIMIT 6
        RETURN item
      )
      RETURN {productCategories, finalProducts: limitedFinalProducts}  
    `);
                const da = yield data.all();
                utils_2.logger.info('Recommend product completed for %s', userId);
                return this.success({ message: "Ping api ran successfully!!", statusCode: http_status_1.default.ok,
                    data: {
                        productRecommendation: da,
                        // salonServices, 
                        // cosmeticServices: filteredCosmeticServices, 
                        // productBundles: cosmeticAndSalonServices[0].productBundles, 
                        // dietPlan: cosmeticAndSalonServices[0].dietPlan 
                    } });
            }
            catch (error) {
                utils_2.logger.error(`Error in Recommend product for ${userId}`);
                throw error;
            }
        });
    }
    recommendSkinCare(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productRecommendationModel = utils_1.arangoDb.collection(config_1.collectionNames.PRODUCT_RECOMMENDATION);
                const userModel = utils_1.arangoDb.collection(config_1.collectionNames.USERS);
                utils_2.logger.info('Recommend product started for %s');
                const images = body.images;
                const userId = body.userId;
                const signedImages = [];
                for (const image of body.images) {
                    const imageUrl = yield this.getSignedUrlToViewObject({ userId, fileName: image.fileName });
                    signedImages.push(imageUrl.data.url);
                }
                console.log({ images: signedImages, userId });
                // const res = await Apis.get("http://127.0.0.1:5002/ping")
                // console.log(res);
                const yoloResponse = yield utils_1.Apis.post("http://127.0.0.1:5002/detect", { images: signedImages, userId });
                // const yoloResponse = {
                //   attributes: ["FINE_LINES", "OPEN_PORES","DARK_CIRCLES", "COMEDONE", "ACNE", "EYE_BAGS", "SKIN_TAG"],
                //   analysedImages: [{
                //     fileName: "",
                //     url: ""
                //   }]
                // }
                // const attributes = Object.keys(yoloResponse.response)
                const actualProducts = yield this.recommendProduct(userId, { attributes: yoloResponse.attributes, skinType: body.skinType });
                if (actualProducts.statusCode !== http_status_1.default.ok)
                    throw this.fail({ message: "Error in getting products", statusCode: http_status_1.default.not_found });
                let recommendedProducts = [];
                // let recommendedSalonServices = actualProducts.data?.salonServices?.map((salon: any) => 
                //   ({ 
                //     salonServiceId: salon?._id,
                //     matchingCount: salon?.matchingCount,
                //     matchingAttributes: salon?.matchingAttributes
                //   }) 
                // )
                // let recommendedProductBundles = actualProducts.data?.productBundles?.map((bundle: any) => 
                // ({
                //   productBundleId: bundle?._id,
                //   matchingProducts: bundle?.matchingProducts,
                //   matchingProductCount: bundle?.matchingProductCount,
                // }))
                // let recommendedCosmeticServices = actualProducts.data?.cosmeticServices?.map((salon: any) => 
                //   ({ 
                //     cosmeticServiceId: salon?._id,
                //     matchingCount: salon?.matchingCount,
                //     matchingAttributes: salon?.matchingAttributes
                //   }) 
                // )
                let documents = {
                    detectedAttributes: yoloResponse.attributes,
                    userId
                };
                for (const prod of actualProducts.data.productRecommendation) {
                    let prodObj = {};
                    prodObj.productCategoryId = prod.productCategories._id;
                    prodObj.products = prod.finalProducts.map((fp) => {
                        const obj = {};
                        obj.productId = fp.products._id;
                        obj.matchesIds = fp.matches.map((m) => m._id);
                        return obj;
                    });
                    recommendedProducts.push(prodObj);
                }
                documents.recommendedProducts = recommendedProducts;
                documents.skinType = body.skinType;
                // documents.dietPlanId = actualProducts?.data?.dietPlan?._id
                documents.skinSummary = (0, utils_1.generateDynamicSkinSummary)(yoloResponse.attributes);
                documents.capturedImages = images.map((i) => ({ fileName: i.fileName, url: i.url }));
                documents.analysedImages = yoloResponse.analysedImages.map((i) => ({ fileName: i.fileName, url: i.url }));
                documents.dateTime = (0, utils_1.getDateTimeForToday)();
                // documents.recommendedSalonServices = recommendedSalonServices
                documents.attributeCode = (yoloResponse === null || yoloResponse === void 0 ? void 0 : yoloResponse.attributeCode) || [];
                // documents.recommendedCosmeticServices = recommendedCosmeticServices
                // documents.recommendedProductBundles = recommendedProductBundles
                const dataInsertedCursor = yield utils_1.arangoDb.query({
                    query: `LET doc = @documents
                INSERT doc INTO ${config_1.collectionNames.PRODUCT_RECOMMENDATION} 
                RETURN NEW`,
                    bindVars: { documents }
                });
                const dataInserted = yield dataInsertedCursor.next();
                // documents.analysedImages = await documents.analysedImages.map(async (d: any) => {
                //   const imageUrl = await this.getSignedUrlToViewObject({ userId, fileName: d.fileName })
                //   return {
                //     fileName: d.fileName,
                //     url: imageUrl.data.url
                //   }
                // } )
                // const publicUrl = fetchRecommendationPublicUrl(userId, dataInserted._id)
                // const updatedData = await productRecommendationModel.update(dataInserted._id, { publicUrl }, { returnNew: true })
                // documents.publicUrl = publicUrl
                documents.recommendedProducts = actualProducts.data.productRecommendation;
                documents.recommendedSalonServices = actualProducts.data.salonServices;
                documents.recommendedCosmeticServices = actualProducts.data.cosmeticServices;
                documents.recommendedProducts = this.divideHighAndLowRecommendationForRecommendSkinCare(actualProducts.data.productRecommendation);
                const userData = yield userModel.document(userId);
                // await deleteCache(collectionNames.PRODUCT_RECOMMENDATION)
                const subject = "Your recommendation has been generated!!";
                utils_2.logger.info('Recommend product completed for %s');
                return this.success({ message: "Recommendation ran successfully!!", statusCode: http_status_1.default.ok, data: documents });
            }
            catch (error) {
                console.log(error);
                utils_2.logger.error(`Error in Recommend product`);
                throw error;
            }
        });
    }
    getSignedUrlToPutObject(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Get signed url  started for %s');
                const fileName = `${body.userId}/${body.fileName}`;
                const signedUrl = yield (0, bucket_upload_1.getSignedUrl)(fileName, body.contentType);
                utils_2.logger.info('Get signed url  completed for %s');
                return this.success({ message: "Recommendation ran successfully!!", statusCode: http_status_1.default.ok, data: { url: signedUrl, fileName: body.fileName, extension: ".jpeg" } });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get signed url ${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
    getSignedUrlToViewObject(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Get signed url  started for %s');
                const fileName = `${body.userId}/${body.fileName}`;
                const signedUrl = yield (0, bucket_upload_1.getSignedUrlToViewObject)(fileName);
                utils_2.logger.info('Get signed url  completed for %s');
                return this.success({ message: "Recommendation ran successfully!!", statusCode: http_status_1.default.ok, data: { url: signedUrl } });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get signed url ${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
    fetchRecommendations(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('FetchRecommendation started for %s');
                const arangoBindVars = {};
                let filters = [];
                if (query.userId) {
                    filters.push(`Prod.userId == @userId`);
                    arangoBindVars.userId = query.userId;
                }
                let arangoQuery = `
      FOR Prod IN product_recommendation
      ${filters.length > 0 ? `FILTER ${filters.join(' AND ')}` : ``}
      SORT Prod.dateTime DESC
      LIMIT ${query.skip}, ${query.limit}
      LET recommendedProducts = (FOR prodRec IN Prod.recommendedProducts 
        LET category = DOCUMENT(prodRec.productCategoryId)
        LET products =  (
        FOR prod IN prodRec.products
        Let p = DOCUMENT(prod.productId)
        Let m = (
          FOR mat in prod.matchesIds
          Let ma = DOCUMENT(mat)
          RETURN ma
        )
        RETURN MERGE(p, { matches: m })
       )

        RETURN MERGE(prodRec, {productCategory: category, products})
      )
      LET recommendedSalonServices = (
        FILTER IS_ARRAY(Prod.recommendedSalonServices)
        FOR salonServices IN Prod.recommendedSalonServices
        LET s = DOCUMENT(salonServices.salonServiceId)
        RETURN MERGE(s, { matchingAttributes: salonServices.matchingAttributes, matchingCount: salonServices.matchingCount })
      )
      LET recommendedCosmeticServices = (
        FILTER IS_ARRAY(Prod.recommendedCosmeticServices)
        FOR cosmeticServices IN Prod.recommendedCosmeticServices
        LET c = DOCUMENT(cosmeticServices.cosmeticServiceId)
        RETURN MERGE(c, { matchingAttributes: cosmeticServices.matchingAttributes, matchingCount: cosmeticServices.matchingCount })
      )
      LET recommendedProductBundles = (
          FILTER IS_ARRAY(Prod.recommendedProductBundles)
          FOR bundle IN Prod.recommendedProductBundles
          LET c = DOCUMENT(bundle.productBundleId)
          LET matchProducts = (
            FOR prodId in bundle.matchingProducts
            LET p = DOCUMENT(prodId)
            return p
          )
          RETURN MERGE(c, { matchingProducts: matchProducts, matchingProductCount: bundle.matchingProductCount })
      )
          LET dietPlan = DOCUMENT(Prod.dietPlanId)
      RETURN MERGE(Prod, { recommendedProducts, recommendedSalonServices, recommendedCosmeticServices, recommendedProductBundles, })`;
                const cursor = yield utils_1.arangoDb.query({
                    query: arangoQuery,
                    bindVars: Object.assign({}, arangoBindVars)
                });
                let data = yield cursor.all();
                for (let d of data) {
                    d.recommendedProducts = this.divideHighAndLowRecommendationForFetchRecommendations(d.recommendedProducts);
                }
                utils_2.logger.info('FetchRecommendation completed for %s');
                return this.success({ message: "Recommendation ran successfully!!", statusCode: http_status_1.default.ok, data });
            }
            catch (error) {
                utils_2.logger.error(`Error in FetchRecommendation ${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
    fetchRecommendationsById(userId, productRecommendationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('FetchRecommendation started for %s');
                const arangoBindVars = {};
                let filters = [];
                if (userId && productRecommendationId) {
                    filters.push(`Prod.userId == @userId`);
                    filters.push(`Prod._id == @productRecommendationId`);
                    arangoBindVars.userId = userId;
                    arangoBindVars.productRecommendationId = productRecommendationId;
                }
                let data = null;
                const cacheKey = `${config_1.collectionNames.PRODUCT_RECOMMENDATION}:${config_1.redisListType.GET_LIST}:fetchRecommendationsById:${userId}${productRecommendationId}`;
                const redisData = yield (0, redis_communication_1.getRedisValue)(cacheKey);
                if (redisData)
                    data = redisData;
                else {
                    let arangoQuery = `
      FOR Prod IN product_recommendation
      ${filters.length > 0 ? `FILTER ${filters.join(' AND ')}` : ``}
      SORT Prod.dateTime DESC
      LET recommendedProducts = (FOR prodRec IN Prod.recommendedProducts 
        LET category = DOCUMENT(prodRec.productCategoryId)
        LET products =  (
        FOR prod IN prodRec.products
        Let p = DOCUMENT(prod.productId)
        Let m = (
          FOR mat in prod.matchesIds
          Let ma = DOCUMENT(mat)
          RETURN ma
        )
        RETURN MERGE(p, { matches: m })
       )
        RETURN MERGE(prodRec, {productCategory: category, products})
      )
      LET recommendedSalonServices = (
          FILTER IS_ARRAY(Prod.recommendedSalonServices)
          FOR salonServices IN Prod.recommendedSalonServices
          LET s = DOCUMENT(salonServices.salonServiceId)
          RETURN MERGE(s, { matchingAttributes: salonServices.matchingAttributes, matchingCount: salonServices.matchingCount })
      )
      LET recommendedCosmeticServices = (
          FILTER IS_ARRAY(Prod.recommendedCosmeticServices)
          FOR cosmeticServices IN Prod.recommendedCosmeticServices
          LET c = DOCUMENT(cosmeticServices.cosmeticServiceId)
          RETURN MERGE(c, { matchingAttributes: cosmeticServices.matchingAttributes, matchingCount: cosmeticServices.matchingCount })
      )
      LET recommendedProductBundles = (
          FILTER IS_ARRAY(Prod.recommendedProductBundles)
          FOR bundle IN Prod.recommendedProductBundles
          LET c = DOCUMENT(bundle.productBundleId)
          LET matchProducts = (
            FOR prodId in bundle.matchingProducts
            LET p = DOCUMENT(prodId)
            return p
          )
          RETURN MERGE(c, { matchingProducts: matchProducts, matchingProductCount: bundle.matchingProductCount })
      )
          LET dietPlan = DOCUMENT(Prod.dietPlanId)
      RETURN MERGE(Prod, { recommendedProducts, recommendedSalonServices, recommendedCosmeticServices, recommendedProductBundles, dietPlan })`;
                    const cursor = yield utils_1.arangoDb.query({
                        query: arangoQuery,
                        bindVars: Object.assign({}, arangoBindVars)
                    });
                    data = yield cursor.all();
                    for (let d of data) {
                        d.recommendedProducts = this.divideHighAndLowRecommendationForFetchRecommendations(d.recommendedProducts);
                    }
                    yield (0, redis_communication_1.setRedisValue)(cacheKey, config_1.redisTtl.PRODUCT_RECOMMENDATION, data);
                }
                // const countRecommendationTimeseriesQuery = `
                // FOR doc IN ${collectionNames.USER_RECOMMENDATION_TIMESERIES}
                // FILTER doc.userId == @userId AND doc.productRecommendationId == @productRecommendationId
                // COLLECT WITH COUNT INTO length
                // RETURN length`
                // const countCursor = await arangoDb.query({ 
                //   query: countRecommendationTimeseriesQuery, 
                //   bindVars: { 
                //     userId: userId,
                //     productRecommendationId: productRecommendationId
                //    } 
                //   });
                // const countTimeseries = await countCursor.next();
                // data[0].countTimeseries = countTimeseries  + 1
                // if(data.length && countTimeseries < 100) {
                //   const timeseriesData = {
                //     userId: userId,
                //     productRecommendationId: productRecommendationId,
                //     recordedTime: getDateTimeForToday()
                //   }
                //   const result = await arangoDb.query({query: `
                //     INSERT @timeseriesData INTO ${collectionNames.USER_RECOMMENDATION_TIMESERIES}
                //     RETURN NEW
                // `, bindVars: {timeseriesData} });
                // }
                const userData = yield user_service_1.UserService.getUserById(userId);
                utils_2.logger.info('FetchRecommendation completed for %s');
                return this.success({ message: "Recommendation ran successfully!!", statusCode: http_status_1.default.ok, data: { productRecommendation: data[0], user: userData.data } });
            }
            catch (error) {
                utils_2.logger.error(`Error in FetchRecommendation ${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
    fetchAdminRecommendationById(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('FetchRecommendation admin started for %s');
                const cacheKey = `${config_1.collectionNames.PRODUCT_RECOMMENDATION}:${config_1.redisListType.GET_ONE}:fetchAdminRecommendationById:${JSON.stringify(query)}`;
                const redisData = yield (0, redis_communication_1.getRedisValue)(cacheKey);
                if (redisData) {
                    utils_2.logger.info('FetchRecommendation admin by filter completed for %s');
                    return this.success({ message: "Recommendation ran successfully!!", statusCode: http_status_1.default.ok, data: { productRecommendation: redisData.productRecommendation, user: redisData.userData } });
                }
                let arangoQuery = `
      LET userData = (
        FOR user IN ${config_1.collectionNames.USERS}
        FILTER user._id == @userId OR user._key == @userId
        LIMIT 1
        RETURN user
      )[0]
      LET productRecommendation = (FOR Prod IN product_recommendation
      FILTER Prod.userId == userData._id
      SORT Prod.dateTime DESC
      LIMIT 1
      LET recommendedProducts = (FOR prodRec IN Prod.recommendedProducts 
        LET category = DOCUMENT(prodRec.productCategoryId)
        LET products =  (
        FOR prod IN prodRec.products
        Let p = DOCUMENT(prod.productId)
        Let m = (
          FOR mat in prod.matchesIds
          Let ma = DOCUMENT(mat)
          RETURN ma
        )
        RETURN MERGE(p, { matches: m })
       )
        RETURN MERGE(prodRec, {productCategory: category, products})
      )
      LET recommendedSalonServices = (
          FILTER IS_ARRAY(Prod.recommendedSalonServices)
          FOR salonServices IN Prod.recommendedSalonServices
          LET s = DOCUMENT(salonServices.salonServiceId)
          RETURN MERGE(s, { matchingAttributes: salonServices.matchingAttributes, matchingCount: salonServices.matchingCount })
      )
      LET recommendedCosmeticServices = (
          FILTER IS_ARRAY(Prod.recommendedCosmeticServices)
          FOR cosmeticServices IN Prod.recommendedCosmeticServices
          LET c = DOCUMENT(cosmeticServices.cosmeticServiceId)
          RETURN MERGE(c, { matchingAttributes: cosmeticServices.matchingAttributes, matchingCount: cosmeticServices.matchingCount })
      )
      LET recommendedProductBundles = (
          FILTER IS_ARRAY(Prod.recommendedProductBundles)
          FOR bundle IN Prod.recommendedProductBundles
          LET c = DOCUMENT(bundle.productBundleId)
          LET matchProducts = (
            FOR prodId in bundle.matchingProducts
            LET p = DOCUMENT(prodId)
            return p
          )
          RETURN MERGE(c, { matchingProducts: matchProducts, matchingProductCount: bundle.matchingProductCount })
      )
          LET dietPlan = DOCUMENT(Prod.dietPlanId)
      RETURN MERGE(Prod, { recommendedProducts, recommendedSalonServices, recommendedCosmeticServices, recommendedProductBundles, dietPlan }))[0]
      RETURN { userData, productRecommendation }
      `;
                const cursor = yield utils_1.arangoDb.query({
                    query: arangoQuery,
                    bindVars: { userId: query.userId }
                });
                let data = yield cursor.next();
                if (!data.userData || !data.productRecommendation)
                    throw this.fail({ message: "No recommendations found for the user!!", statusCode: http_status_1.default.not_found });
                data.productRecommendation.recommendedProducts = this.divideHighAndLowRecommendationForFetchRecommendations(data.productRecommendation.recommendedProducts);
                yield (0, redis_communication_1.setRedisValue)(cacheKey, config_1.redisTtl.PRODUCT_RECOMMENDATION, data);
                const userData = yield user_service_1.UserService.getUserById(data.userData._id);
                data.userData = userData === null || userData === void 0 ? void 0 : userData.data;
                utils_2.logger.info('FetchRecommendation admin by filter completed for %s');
                return this.success({ message: "Recommendation ran successfully!!", statusCode: http_status_1.default.ok, data: { productRecommendation: data.productRecommendation, user: data.userData } });
            }
            catch (error) {
                utils_2.logger.error(`Error in FetchRecommendation admin by filter ${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
    fetchLatestRecommendationByFilter(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('FetchRecommendation started for %s');
                let data = null;
                const cacheKey = `${config_1.collectionNames.PRODUCT_RECOMMENDATION}:${config_1.redisListType.GET_ONE}:fetchLatestRecommendationByFilter:${JSON.stringify(body)}`;
                const redisData = yield (0, redis_communication_1.getRedisValue)(cacheKey);
                if (redisData)
                    data = redisData;
                else {
                    let arangoQuery = `
        LET userData = (
          FOR user IN ${config_1.collectionNames.USERS}
          FILTER SUBSTITUTE(user.phoneNumber, " ", "") == @input 
          OR LOWER(user.email) == LOWER(@input)
          LIMIT 1
          RETURN user
        )[0]
        LET productRecommendation = (FOR Prod IN product_recommendation
        FILTER Prod.userId == userData._id
        SORT Prod.dateTime DESC
        LIMIT 1
        LET recommendedProducts = (FOR prodRec IN Prod.recommendedProducts 
          LET category = DOCUMENT(prodRec.productCategoryId)
          LET products =  (
          FOR prod IN prodRec.products
          Let p = DOCUMENT(prod.productId)
          Let m = (
            FOR mat in prod.matchesIds
            Let ma = DOCUMENT(mat)
            RETURN ma
          )
          RETURN MERGE(p, { matches: m })
         )
          RETURN MERGE(prodRec, {productCategory: category, products})
        )
        LET recommendedSalonServices = (
            FILTER IS_ARRAY(Prod.recommendedSalonServices)
            FOR salonServices IN Prod.recommendedSalonServices
            LET s = DOCUMENT(salonServices.salonServiceId)
            RETURN MERGE(s, { matchingAttributes: salonServices.matchingAttributes, matchingCount: salonServices.matchingCount })
        )
        LET recommendedCosmeticServices = (
            FILTER IS_ARRAY(Prod.recommendedCosmeticServices)
            FOR cosmeticServices IN Prod.recommendedCosmeticServices
            LET c = DOCUMENT(cosmeticServices.cosmeticServiceId)
            RETURN MERGE(c, { matchingAttributes: cosmeticServices.matchingAttributes, matchingCount: cosmeticServices.matchingCount })
        )
        LET recommendedProductBundles = (
          FILTER IS_ARRAY(Prod.recommendedProductBundles)
          FOR bundle IN Prod.recommendedProductBundles
          LET c = DOCUMENT(bundle.productBundleId)
          LET matchProducts = (
            FOR prodId in bundle.matchingProducts
            LET p = DOCUMENT(prodId)
            return p
          )
          RETURN MERGE(c, { matchingProducts: matchProducts, matchingProductCount: bundle.matchingProductCount })
      )
          LET dietPlan = DOCUMENT(Prod.dietPlanId)
        RETURN MERGE(Prod, { recommendedProducts, recommendedSalonServices, recommendedCosmeticServices, recommendedProductBundles, dietPlan }))[0]
        RETURN { userData, productRecommendation }
        `;
                    const cursor = yield utils_1.arangoDb.query({
                        query: arangoQuery,
                        bindVars: { input: body.input }
                    });
                    data = yield cursor.next();
                    if (!data.userData || !data.productRecommendation)
                        throw this.fail({ message: "No recommendations found for the user!!", statusCode: http_status_1.default.not_found });
                    data.productRecommendation.recommendedProducts = this.divideHighAndLowRecommendationForFetchRecommendations(data.productRecommendation.recommendedProducts);
                    yield (0, redis_communication_1.setRedisValue)(cacheKey, config_1.redisTtl.PRODUCT_RECOMMENDATION, data);
                }
                // const countRecommendationTimeseriesQuery = `
                // FOR doc IN ${collectionNames.USER_RECOMMENDATION_TIMESERIES}
                // FILTER doc.userId == @userId AND doc.productRecommendationId == @productRecommendationId
                // COLLECT WITH COUNT INTO length
                // RETURN length`
                // const countCursor = await arangoDb.query({ 
                //   query: countRecommendationTimeseriesQuery, 
                //   bindVars: { 
                //     userId: data.userData._id,
                //     productRecommendationId: data.productRecommendation._id
                //    } 
                //   });
                // const countTimeseries = await countCursor.next();
                // data.countTimeseries = countTimeseries  + 1
                // if(data.productRecommendation && countTimeseries < 100) {
                //   const timeseriesData = {
                //     userId: data.userData._id,
                //     productRecommendationId: data.productRecommendation._id,
                //     recordedTime: getDateTimeForToday()
                //   }
                //   const result = await arangoDb.query({query: `
                //     INSERT @timeseriesData INTO ${collectionNames.USER_RECOMMENDATION_TIMESERIES}
                //     RETURN NEW
                // `, bindVars: {timeseriesData} });
                // }
                // const userData = await UserService.getUserById(data.userData._id)
                utils_2.logger.info('FetchRecommendation by filter completed for %s');
                return this.success({ message: "Recommendation ran successfully!!", statusCode: http_status_1.default.ok, data: { productRecommendation: data.productRecommendation, user: data.userData } });
            }
            catch (error) {
                utils_2.logger.error(`Error in FetchRecommendation by filter ${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
    divideHighAndLowRecommendationForRecommendSkinCare(data) {
        const highRecommendation = [];
        const lowRecommendation = [];
        for (const d of data) {
            let highCount = 0;
            let lowCount = 0;
            let category_high = [];
            let category_low = [];
            const productCategory = d.productCategories;
            const finalProducts = d.finalProducts;
            for (const products of finalProducts) {
                let product = products.products;
                let matches = products.matches;
                if (matches.length >= 3) {
                    let p = Object.assign(Object.assign({}, product), { matches });
                    category_high.push(p);
                    highCount = highCount + 1;
                }
                else {
                    let p = Object.assign(Object.assign({}, product), { matches });
                    category_low.push(p);
                    lowCount = lowCount + 1;
                }
            }
            if (highCount === 0)
                highRecommendation.push({
                    productCategory,
                    products: category_low
                });
            else {
                if (highCount)
                    highRecommendation.push({
                        productCategory,
                        products: category_high
                    });
                if (lowCount)
                    lowRecommendation.push({
                        productCategory,
                        products: category_low
                    });
            }
        }
        return {
            highRecommendation,
            lowRecommendation
        };
    }
    divideHighAndLowRecommendationForFetchRecommendations(data) {
        const highRecommendation = [];
        const lowRecommendation = [];
        for (const d of data) {
            let highCount = 0;
            let lowCount = 0;
            let category_high = [];
            let category_low = [];
            const productCategory = d.productCategory;
            const finalProducts = d.products;
            for (const product of finalProducts) {
                let matches = product === null || product === void 0 ? void 0 : product.matches;
                if ((matches === null || matches === void 0 ? void 0 : matches.length) >= 3) {
                    let p = Object.assign(Object.assign({}, product), { matches });
                    category_high.push(p);
                    highCount = highCount + 1;
                }
                else {
                    let p = Object.assign(Object.assign({}, product), { matches });
                    category_low.push(p);
                    lowCount = lowCount + 1;
                }
            }
            if (highCount === 0)
                highRecommendation.push({
                    productCategory,
                    products: category_low
                });
            else {
                if (highCount)
                    highRecommendation.push({
                        productCategory,
                        products: category_high
                    });
                if (lowCount)
                    lowRecommendation.push({
                        productCategory,
                        products: category_low
                    });
            }
        }
        return {
            highRecommendation,
            lowRecommendation
        };
    }
    pickUniqueSalonServices(salonServices) {
        const selectedServices = [];
        const seenFacials = new Set();
        const seenCleanups = new Set();
        for (let service of salonServices) {
            if (selectedServices.length >= 3)
                break;
            if (service.name.toLowerCase().includes("facial") && !seenFacials.has("facial") && !service.name.toLowerCase().includes("clean up")) {
                selectedServices.push(service);
                seenFacials.add("facial");
            }
            else if ((service.name.toLowerCase().includes("clean up") || service.name.toLowerCase().includes("cleanup")) && !seenCleanups.has("cleanup")) {
                selectedServices.push(service);
                seenCleanups.add("cleanup");
            }
            else if (!service.name.toLowerCase().includes("facial") && !(service.name.toLowerCase().includes("clean up") || service.name.toLowerCase().includes("cleanup"))) {
                selectedServices.push(service);
            }
        }
        return selectedServices.slice(0, 3);
    }
}
exports.SharedService = new SharedServiceClass;
