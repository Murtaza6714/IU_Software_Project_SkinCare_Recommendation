import Services from "./services"
import { Apis, arangoDb, generateDynamicSkinSummary, getDateTimeForToday, uploadBase64ImageToS3 } from "../../utils"
import { logger } from '../../utils'
import HttpStatus from "../../config/http-status"
import { deleteCache, getRedisValue, setRedisValue } from "../../middlewares/redis-communication"
import { ageGroupEnum, collectionNames, companyEmail, companyName, fetchRecommendationPublicUrl, redisListType, redisTtl, tables } from "../../config"
import { aql } from 'arangojs'
import { log } from "winston"
import { getSignedUrl, getSignedUrlToViewObject } from "../../middlewares/bucket-upload"
import { DateTimeSchema } from "../../config/shared-schema"
import { getDefaultAutoSelectFamily } from "net"
import { UserService } from "./user.service"
import { Http } from "winston/lib/winston/transports"
// import dynamoDb from "../../utils/database"
class SharedServiceClass extends Services {
  async getPing() {
    try {
      logger.info('Get Ping started');
      const data = await arangoDb.query(`
      FOR prod IN ${collectionNames.PRODUCTS}
      FOR prodCAT IN 1..1 INBOUND prod ${collectionNames.PRODUCT_CATEGORY_PRODUCTS}
      COLLECT cat = prodCAT INTO matches = prod
      RETURN { cat, matches }   
    `)
    const dataa = arangoDb.collection(collectionNames.PRODUCTS)
    const allCollections = await arangoDb.listCollections()
    // console.log(allCollections);
    
    const d = await data.all()
    console.log(d);
    
      logger.info('Get Ping completed');
      return this.success({ message: "Ping api ran successfully!!", statusCode: HttpStatus.ok })
    } catch (error) {
      logger.error(`Error in getting ping`);
      throw error
    }
  }

  async recommendProduct(userId: string, body: any) {
    try {
      logger.info('Recommend product started for %s', userId);
      const attributes = JSON.stringify(body.attributes)
      let skinTypeQuery = ""
      let skinTypeBundleQuery = ""
      if (body.skinType) {
        skinTypeQuery = `FILTER ${JSON.stringify(body.skinType)} IN product.skinTypes`
        skinTypeBundleQuery = `FILTER ${JSON.stringify(body.skinType)} IN bundle.skinTypes`
      }
      const teenAgeString = JSON.stringify(ageGroupEnum.TEEN_UNDER_20)
      const data = await arangoDb.query(`
      WITH ${collectionNames.PRODUCTS}, ${collectionNames.PRODUCT_CATEGORY}
      FOR attribute IN ${collectionNames.ATTRIBUTES}
      FILTER attribute.name IN ${attributes}
      LET ageGroup = (
        FOR u IN ${collectionNames.USERS}
        FILTER u._id == ${JSON.stringify(userId)}
        LET response = DOCUMENT(u.onBoardingQuestions[0].responseId)
        RETURN response[0].value
      )
      FOR product IN 1..1 INBOUND attribute ${collectionNames.PRODUCT_ATTRIBUTES}
      ${skinTypeQuery? skinTypeQuery: ``}
      // FILTER (ageGroup[0] == ${teenAgeString} && ageGroup[0] IN product.ageGroup) || ageGroup[0] != ${teenAgeString}
      COLLECT products = product INTO matches = attribute
      LET productMatch = matches[*]
      LET matchCount = LENGTH(matches)
      SORT matchCount DESC
      FOR product_category IN 1..1 INBOUND products ${collectionNames.PRODUCT_CATEGORY_PRODUCTS}
      COLLECT productCategories = product_category INTO finalProducts = {products: products, matches: productMatch }
      SORT productCategories.sortOrder ASC
      LET limitedFinalProducts = (
        FOR item IN finalProducts
        LIMIT 6
        RETURN item
      )
      RETURN {productCategories, finalProducts: limitedFinalProducts}  
    `)
    
    const da = await data.all()
    
      logger.info('Recommend product completed for %s', userId);
      return this.success({ message: "Ping api ran successfully!!", statusCode: HttpStatus.ok, 
        data: { 
          productRecommendation: da, 
          // salonServices, 
          // cosmeticServices: filteredCosmeticServices, 
          // productBundles: cosmeticAndSalonServices[0].productBundles, 
          // dietPlan: cosmeticAndSalonServices[0].dietPlan 
        } })
    } catch (error) {
      logger.error(`Error in Recommend product for ${userId}`);
      throw error
    }
  }
  async recommendSkinCare(body: any) {
    try {
      const productRecommendationModel = arangoDb.collection(collectionNames.PRODUCT_RECOMMENDATION)
      const userModel = arangoDb.collection(collectionNames.USERS)
      
      logger.info('Recommend product started for %s');
      const images = body.images
      const userId = body.userId
      const signedImages = []
      for (const image of body.images) {
        const imageUrl = await this.getSignedUrlToViewObject({ userId, fileName: image.fileName })
        signedImages.push(imageUrl.data.url)
      }
      console.log({ images: signedImages, userId });
      // const res = await Apis.get("http://127.0.0.1:5002/ping")
      // console.log(res);
      
      const yoloResponse = await Apis.post("http://127.0.0.1:5002/detect", { images: signedImages, userId })
      // const yoloResponse = {
      //   attributes: ["FINE_LINES", "OPEN_PORES","DARK_CIRCLES", "COMEDONE", "ACNE", "EYE_BAGS", "SKIN_TAG"],
      //   analysedImages: [{
      //     fileName: "",
      //     url: ""
      //   }]
      // }
      // const attributes = Object.keys(yoloResponse.response)
      const actualProducts = await this.recommendProduct(userId, { attributes: yoloResponse.attributes, skinType: body.skinType })
      if(actualProducts.statusCode !== HttpStatus.ok) throw this.fail({ message: "Error in getting products", statusCode: HttpStatus.not_found })
      let recommendedProducts: any = []
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
      let documents: any = {
        detectedAttributes: yoloResponse.attributes,
        userId
      }
      for (const prod of actualProducts.data.productRecommendation) {
        let prodObj: any = {}
        prodObj.productCategoryId = prod.productCategories._id
        prodObj.products = prod.finalProducts.map((fp: any) => {
          const obj: any = {}
          obj.productId = fp.products._id
          obj.matchesIds = fp.matches.map((m: any) => m._id)
          return obj
        })
        recommendedProducts.push(prodObj)
      }
      documents.recommendedProducts = recommendedProducts
      documents.skinType = body.skinType
      // documents.dietPlanId = actualProducts?.data?.dietPlan?._id
      documents.skinSummary = generateDynamicSkinSummary(yoloResponse.attributes)
      documents.capturedImages = images.map((i: any) => ({ fileName: i.fileName, url: i.url }))
      documents.analysedImages = yoloResponse.analysedImages.map((i: any) => ({ fileName: i.fileName, url: i.url }))
      documents.dateTime = getDateTimeForToday()
      // documents.recommendedSalonServices = recommendedSalonServices
      documents.attributeCode = yoloResponse?.attributeCode || []
      // documents.recommendedCosmeticServices = recommendedCosmeticServices
      // documents.recommendedProductBundles = recommendedProductBundles
      const dataInsertedCursor: any = await arangoDb.query({
        query: `LET doc = @documents
                INSERT doc INTO ${collectionNames.PRODUCT_RECOMMENDATION} 
                RETURN NEW`, 
        bindVars: { documents }})
        const dataInserted = await dataInsertedCursor.next();
        
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
      documents.recommendedProducts = actualProducts.data.productRecommendation
      documents.recommendedSalonServices = actualProducts.data.salonServices
      documents.recommendedCosmeticServices = actualProducts.data.cosmeticServices
      documents.recommendedProducts = this.divideHighAndLowRecommendationForRecommendSkinCare(actualProducts.data.productRecommendation)
      const userData = await userModel.document(userId)
      // await deleteCache(collectionNames.PRODUCT_RECOMMENDATION)
      
      const subject = "Your recommendation has been generated!!"
      logger.info('Recommend product completed for %s');
      return this.success({ message: "Recommendation ran successfully!!", statusCode: HttpStatus.ok, data: documents })
    } catch (error) {
      console.log(error)
      logger.error(`Error in Recommend product`);
      throw error
    }
  }
  async getSignedUrlToPutObject(body: any) {
    try {
      logger.info('Get signed url  started for %s');
      const fileName = `${body.userId}/${body.fileName}`
      const signedUrl = await getSignedUrl(fileName, body.contentType)
      
      logger.info('Get signed url  completed for %s');
      return this.success({ message: "Recommendation ran successfully!!", statusCode: HttpStatus.ok, data: { url: signedUrl, fileName: body.fileName, extension: ".jpeg" } })
    } catch (error) {
      logger.error(`Error in Get signed url ${JSON.stringify(error)}`);
      throw error
    }
  }
  async getSignedUrlToViewObject(body: any) {
    try {
      logger.info('Get signed url  started for %s');
      const fileName = `${body.userId}/${body.fileName}`
      const signedUrl = await getSignedUrlToViewObject(fileName)
      
      logger.info('Get signed url  completed for %s');
      return this.success({ message: "Recommendation ran successfully!!", statusCode: HttpStatus.ok, data: { url: signedUrl } })
    } catch (error) {
      logger.error(`Error in Get signed url ${JSON.stringify(error)}`);
      throw error
    }
  }
  async fetchRecommendations(query: any) {
    try {
      logger.info('FetchRecommendation started for %s');
      const arangoBindVars: any = {}
      let filters = [];
      if (query.userId) {
        filters.push(`Prod.userId == @userId`);
        arangoBindVars.userId = query.userId
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
      RETURN MERGE(Prod, { recommendedProducts, recommendedSalonServices, recommendedCosmeticServices, recommendedProductBundles, })`
      const cursor = await arangoDb.query({
        query: arangoQuery,
        bindVars: {...arangoBindVars}
      })
      let data = await cursor.all()
      for (let d of data) {
        d.recommendedProducts = this.divideHighAndLowRecommendationForFetchRecommendations(d.recommendedProducts)
      }
      logger.info('FetchRecommendation completed for %s');
      return this.success({ message: "Recommendation ran successfully!!", statusCode: HttpStatus.ok, data })
    } catch (error) {
      logger.error(`Error in FetchRecommendation ${JSON.stringify(error)}`);
      throw error
    }
  }
  async fetchRecommendationsById(userId: string, productRecommendationId: string) {
    try {
      logger.info('FetchRecommendation started for %s');
      const arangoBindVars: any = {}
      let filters = [];
      if (userId && productRecommendationId) {
        filters.push(`Prod.userId == @userId`);
        filters.push(`Prod._id == @productRecommendationId`);
        arangoBindVars.userId = userId
        arangoBindVars.productRecommendationId = productRecommendationId
      }
      let data = null
      const cacheKey = `${collectionNames.PRODUCT_RECOMMENDATION}:${redisListType.GET_LIST}:fetchRecommendationsById:${userId}${productRecommendationId}`
      const redisData = await getRedisValue(cacheKey)
      if(redisData) data = redisData 
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
      RETURN MERGE(Prod, { recommendedProducts, recommendedSalonServices, recommendedCosmeticServices, recommendedProductBundles, dietPlan })`
      const cursor = await arangoDb.query({
        query: arangoQuery,
        bindVars: {...arangoBindVars}
      })
      data = await cursor.all()
      for (let d of data) {
        d.recommendedProducts = this.divideHighAndLowRecommendationForFetchRecommendations(d.recommendedProducts)
      }
      await setRedisValue(cacheKey, redisTtl.PRODUCT_RECOMMENDATION, data)
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
      const userData = await UserService.getUserById(userId)
      logger.info('FetchRecommendation completed for %s');
      return this.success({ message: "Recommendation ran successfully!!", statusCode: HttpStatus.ok, data: {productRecommendation: data[0], user: userData.data } })
    } catch (error) {
      logger.error(`Error in FetchRecommendation ${JSON.stringify(error)}`);
      throw error
    }
  }
  
  async fetchLatestRecommendationByFilter(body: any) {
    try {
      logger.info('FetchRecommendation started for %s');
      let data = null
      const cacheKey = `${collectionNames.PRODUCT_RECOMMENDATION}:${redisListType.GET_ONE}:fetchLatestRecommendationByFilter:${JSON.stringify(body)}`
      const redisData = await getRedisValue(cacheKey)
      if(redisData) data = redisData 
      else {
        let arangoQuery = `
        LET userData = (
          FOR user IN ${collectionNames.USERS}
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
        `
        const cursor = await arangoDb.query({
          query: arangoQuery,
          bindVars: {input: body.input}
        })
        data = await cursor.next()
        if(!data.userData || !data.productRecommendation) throw this.fail({ message: "No recommendations found for the user!!", statusCode: HttpStatus.not_found })
        data.productRecommendation.recommendedProducts = this.divideHighAndLowRecommendationForFetchRecommendations(data.productRecommendation.recommendedProducts)
        await setRedisValue(cacheKey, redisTtl.PRODUCT_RECOMMENDATION, data)
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

      logger.info('FetchRecommendation by filter completed for %s');
      return this.success({ message: "Recommendation ran successfully!!", statusCode: HttpStatus.ok, data: {productRecommendation: data.productRecommendation, user: data.userData } })
    } catch (error) {
      logger.error(`Error in FetchRecommendation by filter ${JSON.stringify(error)}`);
      throw error
    }
  }

  divideHighAndLowRecommendationForRecommendSkinCare(data: any) {
    const highRecommendation = []
    const lowRecommendation = []

    for (const d of data) {
      let highCount = 0
      let lowCount = 0
      let category_high = []
      let category_low = []
      const productCategory = d.productCategories
      const finalProducts = d.finalProducts
      for (const products of finalProducts) {
        let product = products.products
        let matches = products.matches
        if(matches.length >= 3){
          let p = { ...product, matches }
          category_high.push(p)
          highCount = highCount + 1
        } else {
          let p = { ...product, matches }
          category_low.push(p)
          lowCount = lowCount + 1
        }
      }
      if(highCount === 0) highRecommendation.push({
        productCategory,
        products: category_low
      })
      else {
        if(highCount) highRecommendation.push({
          productCategory,
          products: category_high
        })
        if(lowCount) lowRecommendation.push({
          productCategory,
          products: category_low
        })
      }
    }
    return {
      highRecommendation,
      lowRecommendation
    }
  }
  divideHighAndLowRecommendationForFetchRecommendations(data: any) {
    const highRecommendation = []
    const lowRecommendation = []

    for (const d of data) {
      let highCount = 0
      let lowCount = 0
      let category_high = []
      let category_low = []
      const productCategory = d.productCategory
      const finalProducts = d.products
      for (const product of finalProducts) {
        let matches = product?.matches
        if(matches?.length >= 3){
          let p = { ...product, matches }
          category_high.push(p)
          highCount = highCount + 1
        } else {
          let p = { ...product, matches }
          category_low.push(p)
          lowCount = lowCount + 1
        }
      }
      if(highCount === 0) highRecommendation.push({
        productCategory,
        products: category_low
      })
      else {
        if(highCount) highRecommendation.push({
          productCategory,
          products: category_high
        })
        if(lowCount) lowRecommendation.push({
          productCategory,
          products: category_low
        })
      }
    }
    return {
      highRecommendation,
      lowRecommendation
    }
  }

  pickUniqueSalonServices(salonServices: any) {
    const selectedServices = [];
    const seenFacials = new Set();
    const seenCleanups = new Set();

    for (let service of salonServices) {
      if (selectedServices.length >= 3) break;
  
      if (service.name.toLowerCase().includes("facial") && !seenFacials.has("facial") && !service.name.toLowerCase().includes("clean up")) {
        selectedServices.push(service);
        seenFacials.add("facial");
      } else if ((service.name.toLowerCase().includes("clean up") || service.name.toLowerCase().includes("cleanup")) && !seenCleanups.has("cleanup")) {
        selectedServices.push(service);
        seenCleanups.add("cleanup");
      } else if (!service.name.toLowerCase().includes("facial") && !(service.name.toLowerCase().includes("clean up") || service.name.toLowerCase().includes("cleanup"))) {
        selectedServices.push(service);
      }
    }
    return selectedServices.slice(0, 3);
  }
}

export const SharedService = new SharedServiceClass
