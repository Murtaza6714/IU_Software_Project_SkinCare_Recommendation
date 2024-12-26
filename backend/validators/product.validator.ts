import { check, body, query } from "express-validator"
import { bodyNotEmpty, queryNotEmpty } from "../utils"


export const getProductByFilterValidator = [
    query("page").optional({ checkFalsy: true }).isNumeric().withMessage('Page should be numeric!'),
    query("limit").optional({ checkFalsy: true }).isNumeric().withMessage('Limit should be numeric!'),
    query("search").optional({ checkFalsy: true }).trim(),
    query("catId").optional({ checkFalsy: true }).trim(),
  ]
export const getProductByIdValidator = [
    queryNotEmpty("productId").trim(),
  ]
export const updateProductAttributesValidator = [
    bodyNotEmpty("productId").trim(),
    bodyNotEmpty("attributeIds").isArray().withMessage("attributeIds should be an array!!"),
  ]

