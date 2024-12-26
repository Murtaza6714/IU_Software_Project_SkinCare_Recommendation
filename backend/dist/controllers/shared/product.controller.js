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
exports.updateProductAttributes = exports.updateProduct = exports.getProductById = exports.getProductByFilter = exports.getProductCategories = void 0;
const utils_1 = require("../../utils");
const shared_1 = require("../../service/shared");
const getProductCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const response = yield shared_1.ProductService.getProductCategories();
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductCategories = getProductCategories;
const getProductByFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const query = Object.assign(Object.assign({}, req.query), { page: req.pageNo, limit: req.pageSize, skip: req.skipItem, searchText: req.searchText });
        const response = yield shared_1.ProductService.getProductByFilter(query);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductByFilter = getProductByFilter;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const query = Object.assign(Object.assign({}, req.query), { page: req.pageNo, limit: req.pageSize, skip: req.skipItem, searchText: req.searchText });
        const response = yield shared_1.ProductService.getProductById(query);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checkInputError(req);
        const response = yield shared_1.ProductService.updateProduct(req.body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProduct = updateProduct;
const updateProductAttributes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, utils_1.checkInputError)(req);
        const response = yield shared_1.ProductService.updateProductAttributes(req.body);
        return res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProductAttributes = updateProductAttributes;
