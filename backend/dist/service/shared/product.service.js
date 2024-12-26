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
exports.ProductService = void 0;
const services_1 = __importDefault(require("./services"));
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
const http_status_1 = __importDefault(require("../../config/http-status"));
const redis_communication_1 = require("../../middlewares/redis-communication");
const config_1 = require("../../config");
const arangojs_1 = require("arangojs");
// import dynamoDb from "../../utils/database"
class ProductServiceClass extends services_1.default {
    getProductCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Get Product Categories started for');
                const cacheKey = `${config_1.collectionNames.PRODUCT_CATEGORY}:${config_1.redisListType.GET_LIST}:getProductCategories`;
                const redisData = yield (0, redis_communication_1.getRedisValue)(cacheKey);
                if (redisData) {
                    utils_2.logger.info('Get Product Categories completed');
                    return this.success({ message: "Product Categories fetched successfully!!", data: redisData });
                }
                const result = yield utils_1.arangoDb.query(`
        for category in ${config_1.collectionNames.PRODUCT_CATEGORY}
        SORT category.sortOrder ASC
        return category
    `);
                const productCategories = yield result.all();
                yield (0, redis_communication_1.setRedisValue)(cacheKey, config_1.redisTtl.PRODUCTS, productCategories);
                utils_2.logger.info('Get Product Categories completed');
                return this.success({ message: "Product Categories fetched successfully!!", data: productCategories });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get Product Categories`);
                throw error;
            }
        });
    }
    getProductByFilter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Get Product by filter started for');
                const cacheKey = `${config_1.collectionNames.PRODUCTS}:${config_1.redisListType.GET_LIST}:getProductByFilter:${JSON.stringify(query)}`;
                const redisData = yield (0, redis_communication_1.getRedisValue)(cacheKey);
                if (redisData) {
                    const { products, totalCounts } = redisData;
                    utils_2.logger.info('Get Product by filter completed');
                    return this.success({ message: "Get products by filter Fetched successfully!!", data: products, totalCounts: totalCounts.productCount });
                }
                const arangoBindVars = { skip: query.skip, limit: query.limit };
                const countBindVars = {};
                let filters = [];
                let prodFilters = [];
                if (query.searchText) {
                    prodFilters.push(`LIKE(product.name, CONCAT("%", @searchText, "%"), true) `);
                    arangoBindVars.searchText = query.searchText;
                    countBindVars.searchText = query.searchText;
                }
                if (query.catId) {
                    filters.push(`category._id == @catId`);
                    arangoBindVars.catId = query.catId;
                    countBindVars.catId = query.catId;
                }
                const result = yield utils_1.arangoDb.query({ query: `
        ${query.catId && filters.length ? `FOR category IN ${config_1.collectionNames.PRODUCT_CATEGORY} FILTER ${filters.join(' AND ')}` : ``}
        LET products = (
          FOR product IN ${query.catId ? `OUTBOUND category ${config_1.collectionNames.PRODUCT_CATEGORY_PRODUCTS}` : `${config_1.collectionNames.PRODUCTS}`}
          ${prodFilters.length > 0 ? `FILTER ${prodFilters.join(' AND ')}` : ``}
          LIMIT @skip, @limit
          LET attributes = (
            FOR attribute IN OUTBOUND product ${config_1.collectionNames.PRODUCT_ATTRIBUTES}
            RETURN attribute
          )
          RETURN MERGE(product, { attributes })
        )
        RETURN {
            category: ${query.catId ? "category" : "null"},
            products: products
        }
    `, bindVars: Object.assign({}, arangoBindVars) });
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
                const products = yield result.all();
                const countQuery = `
      ${query.catId && filters.length ? `
        FOR category IN ${config_1.collectionNames.PRODUCT_CATEGORY}
        FILTER ${filters.join(' AND ')}
        LET products = (
          FOR product IN OUTBOUND category ${config_1.collectionNames.PRODUCT_CATEGORY_PRODUCTS}
          ${prodFilters.length > 0 ? `FILTER ${prodFilters.join(' AND ')}` : ``}
          RETURN product
        )
      ` : `
        LET products = (
          FOR product IN ${config_1.collectionNames.PRODUCTS}
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
                const countResult = yield utils_1.arangoDb.query({ query: countQuery, bindVars: Object.assign({}, countBindVars) });
                const totalCounts = yield countResult.next();
                yield (0, redis_communication_1.setRedisValue)(cacheKey, config_1.redisTtl.PRODUCTS, { products, totalCounts });
                utils_2.logger.info('Get Product by filter completed');
                return this.success({ message: "Get products by filter Fetched successfully!!", data: products, totalCounts: totalCounts.productCount });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get Product by filter`);
                throw error;
            }
        });
    }
    getProductById(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Get Product by id started for');
                const cacheKey = `${config_1.collectionNames.PRODUCTS}:${config_1.redisListType.GET_ONE}:getProductByFilter:${JSON.stringify(query)}`;
                const redisData = yield (0, redis_communication_1.getRedisValue)(cacheKey);
                if (redisData) {
                    utils_2.logger.info('Get Product by id completed');
                    return this.success({ message: "Get products by filter Fetched successfully!!", data: redisData });
                }
                const result = yield utils_1.arangoDb.query({ query: `
          FOR product IN ${config_1.collectionNames.PRODUCTS}
          FILTER product._id == @productId
          LET attributes = (
            FOR attribute IN OUTBOUND product ${config_1.collectionNames.PRODUCT_ATTRIBUTES}
            RETURN attribute
          )
          RETURN MERGE(product, { attributes })

    `, bindVars: { productId: query.productId } });
                const product = yield result.next();
                yield (0, redis_communication_1.setRedisValue)(cacheKey, config_1.redisTtl.PRODUCTS, product);
                utils_2.logger.info('Get Product by id completed');
                return this.success({ message: "Get products by filter Fetched successfully!!", data: product });
            }
            catch (error) {
                utils_2.logger.error(`Error in Get Product by id`);
                throw error;
            }
        });
    }
    updateProduct(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Update product started for %s');
                let data = null;
                const productsCollection = utils_1.arangoDb.collection(config_1.collectionNames.PRODUCTS);
                // const userData = await UserService.getUserById(data.userData._id)
                yield productsCollection.update(body.productId, body.productData);
                utils_2.logger.info('Update product by filter completed for %s');
                return this.success({ message: "Product Updated successfully!!", statusCode: http_status_1.default.ok, });
            }
            catch (error) {
                utils_2.logger.error(`Error in Update product by filter ${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
    updateProductAttributes(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Update product attributes started for %s');
                let data = null;
                const productAttributesCollection = utils_1.arangoDb.collection(config_1.collectionNames.PRODUCT_ATTRIBUTES);
                const productId = body.productId;
                yield utils_1.arangoDb.query((0, arangojs_1.aql) `
        FOR attr IN ${productAttributesCollection}
          FILTER attr._from == ${productId}
          REMOVE attr IN ${productAttributesCollection}
      `);
                for (const attributeId of body.attributeIds) {
                    yield productAttributesCollection.save({
                        _from: `${productId}`,
                        _to: `${attributeId}`,
                    });
                }
                utils_2.logger.info('Update product attributes by filter completed for %s');
                return this.success({ message: "Product Updated successfully!!", statusCode: http_status_1.default.ok, });
            }
            catch (error) {
                utils_2.logger.error(`Error in Update product attributes by filter ${JSON.stringify(error)}`);
                throw error;
            }
        });
    }
}
exports.ProductService = new ProductServiceClass;
