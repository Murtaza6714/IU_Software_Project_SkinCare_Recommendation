import { check, body, query } from "express-validator"
import { bodyNotEmpty } from "../utils"


export const loginValidator = [
    bodyNotEmpty("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    bodyNotEmpty("inputType").trim().isIn(["email", "phoneNumber"]).withMessage("inputType value should be email or phoneNumber")
  ]
export const saveUserValidator = [
    bodyNotEmpty("phoneNumber").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    bodyNotEmpty("email").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase())
  ]
export const sendOtpValidator = [
    bodyNotEmpty("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    bodyNotEmpty("inputType").trim().isIn(["email", "phoneNumber"]).withMessage("inputType value should be email or phoneNumber")
  ]
export const verifyOtpValidator = [
    bodyNotEmpty("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
    bodyNotEmpty("action").withMessage("action variable should not be empty!!"),
    bodyNotEmpty("otp").withMessage("otp variable should not be empty!!")
  ]
export const fetchUserValidator = [
  query("email").optional({ checkFalsy: true }).trim().toLowerCase().isEmail().withMessage("email should be an email address!!"),
  query("page").optional({ checkFalsy: true }).isNumeric().withMessage('Page should be numeric!'),
  query("limit").optional({ checkFalsy: true }).isNumeric().withMessage('Limit should be numeric!'),
  query("search").optional({ checkFalsy: true }).trim(),
  ]
