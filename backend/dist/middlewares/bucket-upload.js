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
exports.completeUpload = exports.listPart = exports.abortUpload = exports.uploadPart = exports.startUploadAndCreateUploadId = exports.deleteBackUpUploadPromise = exports.downloadFilePromise = exports.uploadPromise = exports.getSignedUrlToViewObject = exports.uploadData = exports.getSignedUrl = exports.audioUploadPromise = void 0;
// const env = require("../environment");
const AWS = __importStar(require("aws-sdk"));
const fs = __importStar(require("fs"));
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
    s3BucketEndpoint: false,
    // s3ForcePathStyle: true
    // useDualstackEndpoint:true,
    // signatureVersion: "v4",
});
const s3Client = new AWS.S3();
const audioUploadPromise = (file, Key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        s3Client.upload(params, (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
};
exports.audioUploadPromise = audioUploadPromise;
const getSignedUrl = (Key, contentType) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key,
            Expires: 6000,
            // ACL: "public-read",
            ContentType: contentType
        };
        s3Client.getSignedUrl("putObject", params, (err, url) => {
            if (err)
                reject(err);
            resolve(url);
        });
    });
};
exports.getSignedUrl = getSignedUrl;
const uploadData = (Key, contentType, data) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key,
        Body: data,
        ContentType: contentType
    };
    return yield s3Client.upload(params).promise();
});
exports.uploadData = uploadData;
const getSignedUrlToViewObject = (Key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key,
            Expires: 6000,
        };
        s3Client.getSignedUrl("getObject", params, (err, url) => {
            if (err)
                reject(err);
            resolve(url);
        });
    });
};
exports.getSignedUrlToViewObject = getSignedUrlToViewObject;
const uploadPromise = (file, Key) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key,
            Body: fs.readFileSync(file),
            ContentType: 'image/jpeg'
        };
        s3Client.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.uploadPromise = uploadPromise;
const downloadFilePromise = (Key) => {
    return new Promise((resolve, reject) => {
        const params = { Bucket: process.env.AWS_BUCKET, Key };
        console.log(params);
        s3Client.getObject(params, (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
};
exports.downloadFilePromise = downloadFilePromise;
const deleteBackUpUploadPromise = (Key) => {
    return new Promise((resolve, reject) => {
        const params = { Bucket: process.env.AWS_BUCKET, Key };
        s3Client.deleteObject(params, (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
};
exports.deleteBackUpUploadPromise = deleteBackUpUploadPromise;
const startUploadAndCreateUploadId = (Key) => {
    const params = {
        Key,
        Bucket: process.env.AWS_BUCKET
    };
    return new Promise((resolve, reject) => {
        s3Client.createMultipartUpload(params, (err, data) => {
            if (err)
                return reject(err);
            resolve(data);
        });
    });
};
exports.startUploadAndCreateUploadId = startUploadAndCreateUploadId;
const uploadPart = (buffer, uploadId, partNumber, fileName) => {
    const params = {
        Key: fileName,
        Bucket: process.env.AWS_BUCKET,
        Body: buffer,
        PartNumber: partNumber, // Any number from one to 10.000
        UploadId: uploadId, // UploadId returned from the first method
    };
    return new Promise((resolve, reject) => {
        s3Client.uploadPart(params, (err, data) => {
            // console.log(data)
            if (err)
                reject({ PartNumber: partNumber, error: err });
            resolve({ PartNumber: partNumber, ETag: data.ETag });
        });
    });
};
exports.uploadPart = uploadPart;
const abortUpload = (uploadId, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Key: fileName,
        Bucket: process.env.AWS_BUCKET,
        UploadId: uploadId,
    };
    return new Promise((resolve, reject) => {
        s3Client.abortMultipartUpload(params, (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
});
exports.abortUpload = abortUpload;
const listPart = (uploadId, key) => {
    const params = {
        Key: key,
        BucketId: process.env.AWS_BUCKET
    };
    s3Client.listParts();
};
exports.listPart = listPart;
const completeUpload = (uploadId, parts, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Key: fileName,
        Bucket: process.env.AWS_BUCKET,
        UploadId: uploadId,
        MultipartUpload: {
            Parts: parts,
        },
    };
    return new Promise((resolve, reject) => {
        s3Client.completeMultipartUpload(params, (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
});
exports.completeUpload = completeUpload;
