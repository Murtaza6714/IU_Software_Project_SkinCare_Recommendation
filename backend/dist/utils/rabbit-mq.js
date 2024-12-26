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
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = __importDefault(require("../config"));
function rabbitmqSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield amqplib_1.default.connect('amqp://localhost');
            const channel = yield connection.createChannel();
            const transcriptionQueue = config_1.default.queues.TRANSCRIPTION_RESULT_QUEUE;
            const processAudioQueue = config_1.default.queues.PROCESS_AUDIO_QUEUE;
            yield channel.assertQueue(transcriptionQueue, { durable: false });
            yield channel.assertQueue(processAudioQueue, { durable: false });
            globalThis.rabbitMqChannel = channel;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = rabbitmqSetup;
