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
Object.defineProperty(exports, "__esModule", { value: true });
exports.arangoDb = void 0;
const arangojs_1 = require("arangojs");
const logger_1 = require("./logger");
const db = new arangojs_1.Database({
    url: process.env.DB_URL,
    databaseName: process.env.DB_NAME,
    auth: { username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD },
});
exports.arangoDb = db;
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Attempt to fetch the database version
            const version = yield db.version();
            logger_1.logger.info(`🚀 ArangoDB connection is up and running.`);
            logger_1.logger.info(`🚀 Database Version: ${version.version}`);
        }
        catch (error) {
            logger_1.logger.error(`🚀 Failed to connect to ArangoDB: ${JSON.stringify(error.message)}`);
        }
    });
}
// Call the function to check the connection
checkConnection().then((data) => {
    console.log(data);
}).catch(err => {
    console.log(err);
});
