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
exports.AttributeService = void 0;
const services_1 = __importDefault(require("./services"));
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
const config_1 = require("../../config");
// import dynamoDb from "../../utils/database"
class AttributeServiceClass extends services_1.default {
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_2.logger.info('Fetch attributes started for %s');
                const cursor = yield utils_1.arangoDb.query(`
        FOR attribute IN ${config_1.collectionNames.ATTRIBUTES}
        RETURN attribute
      `);
                let attributes = yield cursor.all();
                utils_2.logger.info('Fetch attributes completed for %s');
                return this.success({ message: "Attribute fetched successfully!!", data: attributes });
            }
            catch (error) {
                utils_2.logger.error(`Error in Fetch attributes`);
                throw error;
            }
        });
    }
}
exports.AttributeService = new AttributeServiceClass;
