"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
// import mongoose from "mongoose"
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `./.env` });
require("./utils/database");
// import "./utils/db-backup"
const redis_1 = __importDefault(require("./utils/redis"));
const https_1 = __importDefault(require("https"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const fs_1 = __importDefault(require("fs"));
const shared_route_1 = __importDefault(require("./routes/shared.route"));
const question_route_1 = __importDefault(require("./routes/question.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const attribute_route_1 = __importDefault(require("./routes/attribute.route"));
const logger_1 = require("./utils/logger");
// import "./Config/Db-association"
// import http from "http"
// import rabbitMq from "./utils/rabbit-mq"
const EnvVariables_1 = __importDefault(require("./EnvVariables"));
const pagination_1 = __importDefault(require("./middlewares/pagination"));
// import db from "./utils/database"
// db()
(0, redis_1.default)();
let v = (0, EnvVariables_1.default)();
if (!v.success) {
    console.log("Server could not start . Not all environment variable is provided");
    process.exit();
}
// db()
exports.app = (0, express_1.default)();
// rabbitMq()
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json({ limit: '50mb' }));
exports.app.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb' }));
exports.app.use(body_parser_1.default.json());
const port = process.env.PORT || 8080;
/* Swagger API initialization Served */
require("./models");
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Backend API",
            version: "1.0.0",
            description: "Backend web api created",
        },
        servers: [
            {
                url: "http://localhost:8000",
            },
        ],
    },
    apis: ["./Routes*.js"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
/* Static Content Served */
exports.app.use((0, cookie_parser_1.default)());
exports.app.use("/", express_1.default.static(path_1.default.join(__dirname, "public/starter-dashboard")));
exports.app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, '../Templates')));
/* Swagger Route Served */
exports.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
/* Deals with the CORS */
exports.app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
/* Routes defined for all module */
exports.app.use(pagination_1.default);
exports.app.use("", shared_route_1.default);
exports.app.use("/question", question_route_1.default);
exports.app.use("/user", user_route_1.default);
exports.app.use("/attribute", attribute_route_1.default);
// globalThis.rabbitMqChannel.consume(helpers.queues.TRANSCRIPTION_RESULT_QUEUE, (msg: any) => {
//   // if(!msg.content) reject("No Message Received!!")
//   if (msg.content) {
//     console.log(`Received: ${msg.content.toString()}`);
//     // resolve(msg.content)
//   }
// }, { noAck: true });
// error handling middleware
exports.app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || "";
    let errorData = [];
    if (error.data) {
        errorData = error.data;
    }
    res.status(status).json({
        message: message,
        status: "failure",
        statusCode: status,
        error: errorData,
    });
});
function onError(error) {
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.log(process.env.PORT + " requires elevated privileges");
            process.exit(1);
        case "EADDRINUSE":
            console.log(process.env.PORT + " is already in use");
            process.exit(1);
        default:
            throw error;
    }
}
// if(process.env.MONGODB_URL) {
//   mongoose.connect(
//     process.env.MONGODB_URL
//   ).then(() => {
//     console.log("Connected to db");
//     logger.info("Connected to MongoDb")
//   }).catch((error) => {
//     console.log(error);
//     logger.error("Error in mongodb Connection - ", JSON.stringify(error))
//   });
// }
if (process.env.NODE_ENV === 'production') {
    // only use in development
    //SSL ENABLED SERVER
    const ssl = {
        key: fs_1.default.readFileSync((_a = process.env.SSL_KEY_PATH) !== null && _a !== void 0 ? _a : "", { encoding: 'utf8' }),
        cert: fs_1.default.readFileSync((_b = process.env.SSL_CERT_PATH) !== null && _b !== void 0 ? _b : "", { encoding: 'utf8' }),
        ca: fs_1.default.readFileSync((_c = process.env.SSL_CA_PATH) !== null && _c !== void 0 ? _c : "", { encoding: 'utf8' }),
        passphrase: "qwerty"
    };
    https_1.default.createServer(ssl, exports.app)
        .listen(port, () => {
        logger_1.logger.info(`=================================`);
        logger_1.logger.info(`🚀 Skin care backend portal Service ready at http://localhost:${port} on ${process.env.NODE_ENV}`);
        logger_1.logger.info(`=================================`);
    });
}
else {
    exports.app.listen(port, () => {
        logger_1.logger.info(`=================================`);
        logger_1.logger.info(`🚀 Skin care backend portal Service ready at http://localhost:${port} on ${process.env.NODE_ENV}`);
        logger_1.logger.info(`=================================`);
    });
}
