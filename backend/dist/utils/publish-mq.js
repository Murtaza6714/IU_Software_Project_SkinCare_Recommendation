"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToQueue = void 0;
const publishToQueue = (queueName, message) => {
    try {
        globalThis.rabbitMqChannel.sendToQueue(queueName, Buffer.from(message));
    }
    catch (error) {
        throw error;
    }
};
exports.publishToQueue = publishToQueue;
