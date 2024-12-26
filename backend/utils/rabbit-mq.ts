import amqp from "amqplib"
import helpers from "../config"

export default async function rabbitmqSetup () {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const transcriptionQueue = helpers.queues.TRANSCRIPTION_RESULT_QUEUE 
        const processAudioQueue = helpers.queues.PROCESS_AUDIO_QUEUE 
        await channel.assertQueue(transcriptionQueue, { durable: false });
        await channel.assertQueue(processAudioQueue, { durable: false });
        globalThis.rabbitMqChannel = channel

    } catch (error) {
        throw error
    }
}