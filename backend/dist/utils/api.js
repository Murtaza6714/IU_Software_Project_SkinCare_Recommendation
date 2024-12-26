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
exports.Apis = void 0;
const axios_1 = __importDefault(require("axios"));
class Apis {
    static post(url_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (url, data, isInternal = true) {
            try {
                const payload = {
                    url,
                    data,
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    }
                };
                // if (isInternal) {
                //     payload.headers.accessKey = config.serverAuth.secret
                // }
                let result = yield (0, axios_1.default)(payload);
                return result.data;
            }
            catch (error) {
                const errorRes = new Error(error.response.data.message);
                errorRes.statusCode = error.response.data.statusCode;
                errorRes.data = error.response.data.error;
                throw errorRes;
            }
        });
    }
    static get(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, params = '', isInternal = true) {
            try {
                const qs = params;
                const payload = {
                    params: qs,
                    method: 'get',
                    headers: {
                        'content-type': 'application/json'
                    },
                };
                // if (isInternal) {
                //     payload.headers.accessKey = serverAuth.secret
                // }
                let result = yield axios_1.default.get(url, payload);
                return result.data;
            }
            catch (error) {
                const errorRes = new Error(error.response.data.message);
                errorRes.statusCode = error.response.data.statusCode;
                errorRes.data = error.response.data.error;
                throw errorRes;
            }
        });
    }
}
exports.Apis = Apis;
;
