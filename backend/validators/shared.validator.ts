import { check, body, query } from "express-validator"
import { bodyNotEmpty } from "../utils"


export const fetchLatestRecommendationByFilterValidator = [
    bodyNotEmpty("input").trim().customSanitizer(value => value.replace(/\s+/g, '').toLowerCase()),
  ]

