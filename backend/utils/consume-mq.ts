import helpers from "../config"
const transcriptionQueue = helpers.queues.TRANSCRIPTION_RESULT_QUEUE 

// const consumeToQueue = (queue: string) => {
//   return new Promise((resolve, reject) => {
    globalThis.rabbitMqChannel.consume(transcriptionQueue, (msg: any) => {
      // if(!msg.content) reject("No Message Received!!")
      if (msg.content) {
        console.log(`Received: ${msg.content.toString()}`);
        // resolve(msg.content)
      }
    }, { noAck: true });
//   })

// }
