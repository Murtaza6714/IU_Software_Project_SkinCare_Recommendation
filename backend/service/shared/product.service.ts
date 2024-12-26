import Services from "./services"
import { Apis, arangoDb, getDateTimeForToday, uploadBase64ImageToS3 } from "../../utils"
import { logger } from '../../utils'
import HttpStatus from "../../config/http-status"
import { getRedisValue, setRedisValue } from "../../middlewares/redis-communication"
import { collectionNames, redisListType, redisTtl } from "../../config"
import { aql } from 'arangojs'
import { log } from "winston"
import { Collection } from "mongoose"
// import dynamoDb from "../../utils/database"
class ProductServiceClass extends Services {

  async getProductCategories() {
    try {
      logger.info('Get Product Categories started for');
      const cacheKey = `${collectionNames.PRODUCT_CATEGORY}:${redisListType.GET_LIST}:getProductCategories`
      const redisData = await getRedisValue(cacheKey)
      if(redisData) {
        logger.info('Get Product Categories completed');
        return this.success({ message: "Product Categories fetched successfully!!", data: redisData })
      }

      const result = await arangoDb.query(`
        for category in ${collectionNames.PRODUCT_CATEGORY}
        SORT category.sortOrder ASC
        return category
    `)
      const productCategories = await result.all()
    
      await setRedisValue(cacheKey, redisTtl.PRODUCTS, productCategories)
      logger.info('Get Product Categories completed');
      return this.success({ message: "Product Categories fetched successfully!!", data: productCategories })
    } catch (error) {
      logger.error(`Error in Get Product Categories`);
      throw error
    }
  }
  async getProductByFilter(query: any) {
    try {
      logger.info('Get Product by filter started for');
      const cacheKey = `${collectionNames.PRODUCTS}:${redisListType.GET_LIST}:getProductByFilter:${JSON.stringify(query)}`
      const redisData = await getRedisValue(cacheKey)
      if(redisData) {
        const { products, totalCounts } = redisData
        logger.info('Get Product by filter completed');
        return this.success({ message: "Get products by filter Fetched successfully!!", data: products, totalCounts: totalCounts.productCount })
      }
      const arangoBindVars: any = { skip : query.skip, limit: query.limit }
      const countBindVars: any = {}
      let filters = [];
      let prodFilters = [];
      if (query.searchText) {
        prodFilters.push(`LIKE(product.name, CONCAT("%", @searchText, "%"), true) `);
        arangoBindVars.searchText = query.searchText
        countBindVars.searchText = query.searchText
      }
      if (query.catId) {
        filters.push(`category._id == @catId`);
        arangoBindVars.catId = query.catId
        countBindVars.catId = query.catId
      }
      
      const result = await arangoDb.query({ query: `
        ${query.catId && filters.length ? `FOR category IN ${collectionNames.PRODUCT_CATEGORY} FILTER ${filters.join(' AND ')}` : ``}
        LET products = (
          FOR product IN ${query.catId ? `OUTBOUND category ${collectionNames.PRODUCT_CATEGORY_PRODUCTS}` : `${collectionNames.PRODUCTS}`}
          ${prodFilters.length > 0 ? `FILTER ${prodFilters.join(' AND ')}` : ``}
          LIMIT @skip, @limit
          LET attributes = (
            FOR attribute IN OUTBOUND product ${collectionNames.PRODUCT_ATTRIBUTES}
            RETURN attribute
          )
          RETURN MERGE(product, { attributes })
        )
        RETURN {
            category: ${query.catId ? "category" : "null"},
            products: products
        }
    `, bindVars: {...arangoBindVars} })
    //   const result = await arangoDb.query({ query: `
    //     FOR category IN ${collectionNames.PRODUCT_CATEGORY}
    //     ${filters.length > 0 ? `FILTER ${filters.join(' AND ')}` : ``}
    //     LET products = (
    //     FOR product IN OUTBOUND category ${collectionNames.PRODUCT_CATEGORY_PRODUCTS}
    //     ${prodFilters.length > 0 ? `FILTER ${prodFilters.join(' AND ')}` : ``}
    //     LIMIT @skip, @limit
    //     LET attributes = (
    //       FOR attribute in OUTBOUND product ${collectionNames.PRODUCT_ATTRIBUTES}
    //       return attribute
    //     )
    //     RETURN  MERGE(product, {attributes})
    //     )
    //     RETURN {
    //         category: category,
    //         products: products
    //     }
    // `, bindVars: {...arangoBindVars} })
      const products = await result.all()
      const countQuery = `
      ${query.catId && filters.length ? `
        FOR category IN ${collectionNames.PRODUCT_CATEGORY}
        FILTER ${filters.join(' AND ')}
        LET products = (
          FOR product IN OUTBOUND category ${collectionNames.PRODUCT_CATEGORY_PRODUCTS}
          ${prodFilters.length > 0 ? `FILTER ${prodFilters.join(' AND ')}` : ``}
          RETURN product
        )
      ` : `
        LET products = (
          FOR product IN ${collectionNames.PRODUCTS}
          ${prodFilters.length > 0 ? `FILTER ${prodFilters.join(' AND ')}` : ``}
          RETURN product
        )
      `}
      
      LET productCount = LENGTH(products)
      RETURN {
          productCount: productCount
      }
  `;
  //     const countQuery = `
  //       ${query.catId && filters.length ? `FOR category IN ${collectionNames.PRODUCT_CATEGORY} FILTER ${filters.join(' AND ')}` : ``}
  //       // FOR category IN ${collectionNames.PRODUCT_CATEGORY}
  //       // ${filters.length > 0 ? `FILTER ${filters.join(' AND ')}` : ``}
  //       LET products = (
  //       FOR product IN OUTBOUND category ${collectionNames.PRODUCT_CATEGORY_PRODUCTS}
  //       ${prodFilters.length > 0 ? `FILTER ${prodFilters.join(' AND ')}` : ``}
  //       RETURN product
  //       )
  //       LET productCount = LENGTH(products)
  //       RETURN {
  //           productCount: productCount
  //       }
  // `;
  
      const countResult = await arangoDb.query({ query: countQuery, bindVars: { ...countBindVars } });
      const totalCounts: any = await countResult.next();
      await setRedisValue(cacheKey, redisTtl.PRODUCTS, {products, totalCounts})
      logger.info('Get Product by filter completed');
      return this.success({ message: "Get products by filter Fetched successfully!!", data: products, totalCounts: totalCounts.productCount })
    } catch (error) {
      logger.error(`Error in Get Product by filter`);
      throw error
    }
  }
  async getProductById(query: any) {
    try {
      logger.info('Get Product by id started for');
      const cacheKey = `${collectionNames.PRODUCTS}:${redisListType.GET_ONE}:getProductByFilter:${JSON.stringify(query)}`
      const redisData = await getRedisValue(cacheKey)
      if(redisData) {
        logger.info('Get Product by id completed');
        return this.success({ message: "Get products by filter Fetched successfully!!", data: redisData })
      }
      const result = await arangoDb.query({ query: `
          FOR product IN ${collectionNames.PRODUCTS}
          FILTER product._id == @productId
          LET attributes = (
            FOR attribute IN OUTBOUND product ${collectionNames.PRODUCT_ATTRIBUTES}
            RETURN attribute
          )
          RETURN MERGE(product, { attributes })

    `, bindVars: { productId: query.productId} })

      const product = await result.next()
      
      await setRedisValue(cacheKey, redisTtl.PRODUCTS, product)
      logger.info('Get Product by id completed');
      return this.success({ message: "Get products by filter Fetched successfully!!", data: product })
    } catch (error) {
      logger.error(`Error in Get Product by id`);
      throw error
    }
  }

  async updateProduct(body: any) {
    try {
      logger.info('Update product started for %s');
      let data = null
      const productsCollection = arangoDb.collection(collectionNames.PRODUCTS);
      // const userData = await UserService.getUserById(data.userData._id)
      await productsCollection.update(body.productId, body.productData);
      logger.info('Update product by filter completed for %s');
      return this.success({ message: "Product Updated successfully!!", statusCode: HttpStatus.ok, })
    } catch (error) {
      logger.error(`Error in Update product by filter ${JSON.stringify(error)}`);
      throw error
    }
  }
  async updateProductAttributes(body: any) {
    try {
      logger.info('Update product attributes started for %s');
      let data = null
      const productAttributesCollection = arangoDb.collection(collectionNames.PRODUCT_ATTRIBUTES);
      const productId = body.productId
      await arangoDb.query(aql`
        FOR attr IN ${productAttributesCollection}
          FILTER attr._from == ${productId}
          REMOVE attr IN ${productAttributesCollection}
      `);

      for (const attributeId of body.attributeIds) {
        await productAttributesCollection.save({
          _from: `${productId}`,
          _to: `${attributeId}`,
        });
      }
      logger.info('Update product attributes by filter completed for %s');
      return this.success({ message: "Product Updated successfully!!", statusCode: HttpStatus.ok, })
    } catch (error) {
      logger.error(`Error in Update product attributes by filter ${JSON.stringify(error)}`);
      throw error
    }
  }

}

export const ProductService = new ProductServiceClass
