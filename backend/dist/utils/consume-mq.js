"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const transcriptionQueue = config_1.default.queues.TRANSCRIPTION_RESULT_QUEUE;
// const consumeToQueue = (queue: string) => {
//   return new Promise((resolve, reject) => {
globalThis.rabbitMqChannel.consume(transcriptionQueue, (msg) => {
    // if(!msg.content) reject("No Message Received!!")
    if (msg.content) {
        console.log(`Received: ${msg.content.toString()}`);
        // resolve(msg.content)
    }
}, { noAck: true });
//   })
// }
