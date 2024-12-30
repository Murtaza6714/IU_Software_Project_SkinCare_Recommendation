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

