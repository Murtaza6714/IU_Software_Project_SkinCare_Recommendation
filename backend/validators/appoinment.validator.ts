import { check, body, query } from "express-validator"
import { bodyNotEmpty } from "../utils"


export const createAppoinmentValidator = [
    bodyNotEmpty("serviceName").trim(),
    bodyNotEmpty("serviceAmount").trim().isInt().withMessage("serviceAmount should be an integer!"),
    bodyNotEmpty("paymentLink").trim(),
    bodyNotEmpty("email").trim().toLowerCase().isEmail().withMessage("email should be an email address!!"),
    body("phoneNumber").trim().optional({ checkFalsy: true }).customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    body("countryCode").trim().optional({ checkFalsy: true }),
  ]
export const fetchAppoinmentValidator = [
    query("email").optional({ checkFalsy: true }).trim().toLowerCase().isEmail().withMessage("email should be an email address!!"),
    query("page").optional({ checkFalsy: true }).isNumeric().withMessage('Page should be numeric!'),
    query("limit").optional({ checkFalsy: true }).isNumeric().withMessage('Limit should be numeric!'),
    query("search").optional({ checkFalsy: true }),
  ]

