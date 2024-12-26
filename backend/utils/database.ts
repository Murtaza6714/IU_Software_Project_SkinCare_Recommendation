import { Database } from "arangojs";
import { logger } from "./logger";

const db = new Database({
  url: process.env.DB_URL as string,
  databaseName: process.env.DB_NAME as string,
  auth: { username: process.env.DB_USERNAME as string, password: process.env.DB_PASSWORD as string },
});

export const arangoDb = db

async function checkConnection() {
    try {
      // Attempt to fetch the database version
      const version = await db.version();
      logger.info(`🚀 ArangoDB connection is up and running.`)
      logger.info(`🚀 Database Version: ${version.version}`)
    } catch (error: any) {
      logger.error(`🚀 Failed to connect to ArangoDB: ${JSON.stringify(error.message)}`)
    }
  }
  
  // Call the function to check the connection
  checkConnection().then((data) => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  });