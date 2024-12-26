export const publishToQueue = (queueName: string, message: any) => {
    try {
        globalThis.rabbitMqChannel.sendToQueue(queueName, Buffer.from(message));
    } catch (error) {
        throw error
    }
}