'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Services {
    success({ statusCode = 200, token = undefined, data = [], totalCounts = null, message = "" }) {
        return {
            status: 'success',
            statusCode,
            token,
            data,
            totalCounts,
            message
        };
    }
    fail({ message = "Something went wrong", statusCode = 500 }) {
        const error = new Error(message);
        error.statusCode = statusCode;
        return error;
    }
    getDateTime(dateTime) {
        return (0, moment_1.default)(dateTime).format("YYYY-MM-DD HH:mm:ss");
    }
    getNextDayDateTime(dateTime) {
        return (0, moment_1.default)(dateTime).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
    }
    getDateOnly(dateTime) {
        return (0, moment_1.default)(dateTime).format("YYYY-MM-DD");
    }
    getNextDayDateOnly(dateTime) {
        return (0, moment_1.default)(dateTime).add(1, 'days').format("YYYY-MM-DD");
    }
    clearImage(filePath) {
        filePath = path_1.default.join(__dirname, "../", filePath);
        fs_1.default.unlink(filePath, err => {
            console.log(err);
        });
    }
    paginate(page, limit) {
        let pagination = {};
        if (limit)
            pagination.limit = parseInt(limit);
        pagination.offset = parseInt(page) ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 0) : 0;
        return pagination;
    }
}
exports.default = Services;
