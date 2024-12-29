"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceNameEnum = exports.adminRoleActionEnum = exports.adminRoles = exports.ageGroupEnum = exports.aiGeneratedSkinSummary = exports.attributesEnum = exports.skinTypesEnum = exports.fetchRecommendationPublicUrl = exports.defaultOtpExpiry = exports.companyEmail = exports.companyName = exports.redisListType = exports.redisTtl = exports.collectionNames = exports.status = exports.questionOptionType = exports.tables = void 0;
__exportStar(require("./error-message"), exports);
__exportStar(require("./http-status-code"), exports);
// export * from './shared-schema'
exports.default = {
    sqlDb: {
        host: process.env.SERVER_HOST || 'localhost',
        dbUser: process.env.DB_USER || 'root',
        dbPassword: process.env.DB_PASSWORD || '1234',
        dbName: process.env.DB_NAME || 'obex_db'
    },
    jwtOption: {
        secret: 'ausad4dcas68cas68c165cs546sadf46sd5f4s6d5s6df541s61sdc8sd64sa4r8g4dsfbciksahdkajsdfas',
        expiresIn: '45d'
    },
    serverAuth: {
        secret: 'askaasdasas54d6as8d4as68d4as56f84sd6f8s74f154dsa21x65dds4fa7580'
    },
    country: 'en-IN',
    timeZone: 'Asia/Kolkata',
    queues: {
        PROCESS_AUDIO_QUEUE: "audio_transcription_queue",
        TRANSCRIPTION_RESULT_QUEUE: "transcription_result_queue",
        DISTRIBUTER: "DISTRIBUTER"
    },
    defaultOtpExpiry: 300
};
exports.tables = {
    ASSESSMENT_TEMPLATE: 'assessment_template',
    QUESTION_OPTION_TYPE: 'question_option_type',
    CONDITION_BASED_ASSESSMENT: 'condition_based_assessment',
    PARIENT_RESPONSE: 'patient_response',
    QUESTION_CATEGORY: 'question_category',
    DAILY_PATIENT_VISIT: 'daily_patient_visit',
    PATIENT_VITAL_SIGNAL: 'patient_vital_signal',
    RECORDED_AUDIO: 'recorded_audio',
};
exports.questionOptionType = {
    SINGLE_SELECTION: "SINGLE_SELECTION",
    MULTIPLE_SELECTION: "MULTI_SELECTION",
    TEXT: "TEXT",
    MATRIX_GRID: "MATRIX_GRID",
    RATING: "RATING",
    EMOJI_RATING: "EMOJI_RATING",
    AUDIO: "AUDIO",
    VIDEO: "VIDEO",
    SIGNATURE: "SIGNATURE",
    INTRODUCTION: "INTRODUCTION",
    AI_AVATAR: "AI_AVATAR",
    BOOLEAN: "BOOLEAN",
    VALUE_PICKER: "VALUE_PICKER",
    IMAGE_SELECTION: "IMAGE_SELECTION",
    NUMBER: "NUMBER",
    TIME: "TIME",
    DATE: "DATE",
    DATE_TIME: "DATE_TIME",
    EMOJI_SENTIMENTS: "EMOJI_SENTIMENTS",
};
exports.status = {
    COMPLETED: "COMPLETED",
    STARTED: "STARTED",
    RUNNING: "RUNNING",
};
exports.collectionNames = {
    USERS: "users",
    QUESTIONS: "questions",
    PRODUCT_RECOMMENDATION: "product_recommendation",
    OPTIONS: "options",
    QUESTION_OPTIONS: "question_options",
    ATTRIBUTES: "attributes",
    PRODUCT_ATTRIBUTES: "product_attributes",
    PRODUCT_CATEGORY: "product_category",
    PRODUCTS: "products",
    PRODUCT_CATEGORY_PRODUCTS: "product_category_products"
};
exports.redisTtl = {
    PRODUCT_RECOMMENDATION: 86000,
    PRODUCTS: 86000,
    ADMIN: 86000,
};
exports.redisListType = {
    GET_ONE: "getOne", // 1 Day
    GET_LIST: "getList"
};
exports.companyName = "Skin Care";
exports.companyEmail = "mrtzsingapurwala@gmail.com";
exports.defaultOtpExpiry = 300;
const fetchRecommendationPublicUrl = (userId, recommendationId) => {
    return `https://localhost:3000/user/view-skincare-recommnedations?userId=${userId}&productRecommendationId=${recommendationId}`;
};
exports.fetchRecommendationPublicUrl = fetchRecommendationPublicUrl;
exports.skinTypesEnum = {
    DRY_SKIN: "DRY_SKIN",
    NORMAL_SKIN: "NORMAL_SKIN",
    COMBINATION_SKIN: "COMBINATION_SKIN",
    OILY_SKIN: "OILY_SKIN",
    SENSITIVE_SKIN: "SENSITIVE_SKIN"
};
exports.attributesEnum = {
    ACNE: "ACNE",
    COMEDONE: "COMEDONE",
    DARK_CIRCLES: "DARK_CIRCLES",
    EYE_BAGS: "EYE_BAGS",
    SKIN_TAG: "SKIN_TAG",
    OPEN_PORES: "OPEN_PORES",
    PIGMENTATION: "PIGMENTATION",
    SUN_TANS: "SUN_TANS",
    OILY_SKIN: "OILY_SKIN",
    ACNE_PRONE_SKIN: "ACNE_PRONE_SKIN",
    FINE_LINES: "FINE_LINES",
    DULL_SKIN: "DULL_SKIN",
    DARK_SPOTS: "DARK_SPOTS",
    UNEVEN_SKIN: "UNEVEN_SKIN",
    ACNE_SCAR: "ACNE_SCAR",
    WRINKLES: "WRINKLES",
    DARK_SKIN: "DARK_SKIN",
};
exports.aiGeneratedSkinSummary = {
    "ACNE": "Acne is a common skin condition that happens when hair follicles under the skin become clogged.",
    "COMEDONE": "Comedones are small, flesh-colored, white, or black bumps that give skin a rough texture.",
    "DARK_CIRCLES": "The area of skin below your eyes looks darkened than usual.",
    "EYE_BAGS": "Bags under eyes are mild swelling or puffiness under the eyes.",
    "SKIN_TAG": "These are small, noncancerous growths that tend to be the same color as skin.",
    "OPEN_PORES": "Small openings on the skin's surface that allow sweat and sebum (natural oils) to reach the skin's surface.",
    "PIGMENTATION": "Pigmentation is when certain areas of the skin turn darker than the rest. It can appear in smaller patches.",
    "SUN_TANS": "Browning or a brown color of the skin resulting from exposure to sunlight.",
    "OILY_SKIN": "Oily skin is caused by an over-secretion of sebum.",
    "ACNE_PRONE_SKIN": "Acne-prone skin is characterised by persistent and recurring pimples accompanied by over secretion of sebum.",
    "FINE_LINES": "The start of wrinkles and look like small creases on your skin.",
    "DULL_SKIN": "When dead skin cells build up on the outer layers of your skin, it can cause your skin to look dull, dry, and flakey.",
    "DARK_SPOTS": "Small flat dark areas on skin due to an overproduction of melanin.",
    "UNEVEN_SKIN": "An uneven looking complexion can be caused either by variations in texture or variations in colour.",
    "ACNE_SCAR": "Scars that remain after acne treatment can be either depressed or raised.",
    "WRINKLES": "Wrinkles are visible creases or folds in the skin.",
    "DARK_SKIN": "Your skin tone is darker in certain areas.",
};
exports.ageGroupEnum = {
    TEEN_UNDER_20: "Teen (Under 20)",
    YOUNG_ADULT_20: "Young adult (20s)",
    ADULT_30_40: "Adult (30s - 40s)",
    MATURE_ADULT_50_60: "Mature Adult (50s - 60s)",
    SENIOR_ADULT_20: "Senior (70 and above)",
};
exports.adminRoles = {
    SUPER_ADMIN: "super-admin",
    ADMIN: "admin",
};
exports.adminRoleActionEnum = {
    READ: "read",
    WRITE: "write",
};
exports.resourceNameEnum = {
    PRODUCT: "product",
    USER: "user",
    APPOINTMENT: "appointment",
    PRODUCT_RECOMMENDATION: "product_recommendation",
};
