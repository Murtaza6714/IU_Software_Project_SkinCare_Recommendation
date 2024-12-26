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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const colorette = __importStar(require("colorette"));
const winston_1 = require("winston");
const { combine, timestamp, printf, splat } = winston_1.format;
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} :  [${level}] : ${message}`;
});
const errorLoggingPath = path_1.default.join("logs", "error-logs");
const infoLoggingPath = path_1.default.join("logs", "info-logs");
const errorTransport = new winston_daily_rotate_file_1.default({
    filename: errorLoggingPath + "/application-%DATE%.log",
    // dirname: path.join(__dirname, errorLoggingPath),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
});
const infoTransport = new winston_daily_rotate_file_1.default({
    filename: infoLoggingPath + "/application-%DATE%.log",
    // dirname: path.join(__dirname, infoLoggingPath),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
});
const consoleFormat = winston_1.format.printf((_a) => {
    var { level, message, timestamp } = _a, metadata = __rest(_a, ["level", "message", "timestamp"]);
    const levelUpper = level.toUpperCase();
    let emoji = "";
    switch (levelUpper) {
        case "INFO":
            emoji = "✌️";
            message = colorette.green(message);
            level = colorette.greenBright(level);
            break;
        case "WARN":
            emoji = "⚠️";
            message = colorette.yellow(message);
            level = colorette.yellowBright(level);
            break;
        case "ERROR":
            emoji = "💥";
            message = colorette.red(message);
            level = colorette.redBright(level);
            break;
        default:
            break;
    }
    return `${emoji}  ${colorette.whiteBright(timestamp)} : [${level}] : ${message}`;
});
exports.logger = (0, winston_1.createLogger)({
    format: combine(timestamp(), splat(), myFormat),
    transports: [errorTransport, infoTransport],
});
if (process.env.NODE_ENV !== "production") {
    const consoleTransport = new winston_1.transports.Console({
        format: combine(timestamp(), splat(), consoleFormat),
    });
    exports.logger.add(consoleTransport);
}
