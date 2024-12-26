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
exports.fetchAttribute = void 0;
const utils_1 = require("../../utils");
const shared_1 = require("../../service/shared");
const fetchAttribute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const response = yield shared_1.AttributeService.fetch();
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchAttribute = fetchAttribute;
