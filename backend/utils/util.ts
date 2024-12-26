import { validationResult, body, query, param, check } from "express-validator";
import fs from 'fs'
import { logger } from './logger'
import bcryptJs from "bcryptjs";
import sgMail from '@sendgrid/mail'
import ejs from "ejs"
import { DateTime } from "luxon";
import path from "path"
import axios from "axios"
import jwt from "jsonwebtoken"
import  { Transporter, createTransport }  from "nodemailer"
import { promisify } from "util"
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { uploadPromise } from "../middlewares/bucket-upload";
import { arangoDb } from "./database";
import { aiGeneratedSkinSummary, attributesEnum, skinTypesEnum } from "../config";
import client from 'twilio';
    // if(process.env.SENDGRID_API_KEY !== undefined)
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const connection = {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    service: process.env.MAIL_MAILER as string,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
}
const transporter: Transporter = createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: 'mrtzsingapurwala@gmail.com',
        pass: 'pkhr pivy focd bzrm'
    },
    secure: true, 
    port: 465,
    tls: {rejectUnauthorized: false},
  });
export const bodyNotEmpty = (key: string | string[] | undefined) => {
    return body(key).notEmpty().withMessage(`${key} field is empty`);
};

export const queryNotEmpty = (key: string | string[] | undefined) => {
    return query(key).notEmpty().withMessage(`${key} field is empty`);
};

export const paramNotEmpty = (key: string | string[] | undefined) => {
    return param(key).notEmpty().withMessage(`${key} field is empty`);
};
export const ValidateDateFormat = (key: string | string[] | undefined) =>{
    return check(key).matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).withMessage(`${key} format should be (YYYY-MM-DD)`)
}
export const ValidateStatus = (key: string | string[] | undefined) =>{
    return check(key).trim().matches(/^[A-Z]+$/).withMessage(`${key} Should be in caps`)
}
export const ValidateName = (key: string | string[] | undefined) =>{
    return check(key).matches(/^([a-zA-Z]+\s)*[a-zA-Z]+$/).withMessage(`${key} can contain only Uppercase, lowercase and single space`)
}
export const clearImage= (path: fs.PathLike)=>{
    fs.unlink(path, (err) => {
        if (err) {
            logger.error(err)
        }})
}

export const generateToken = (tokenData: any, secretKey: any, expiresIn: any) => {
    return jwt.sign(tokenData, secretKey, { expiresIn: '30d' });
  };

export const hashPassword = (password: string) => {
    if(process.env.SALT_ROUNDS) {
        const salt = bcryptJs.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        return bcryptJs.hashSync(password, salt);
    }
  };
  
export const comparePassword = (password1: string, password2: string) => {
    return bcryptJs.compareSync(password1, password2);
  };
export const checkInputError = function(req: any, images: any = []) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (images.length > 0) {
            images.forEach((image: { path: any; }) => {
                clearImage(image.path);
            });
        }
        const error: any = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
};


export const sendEmail = async function({to, from, subject, templateName, data}: { to: string, from: string, subject: string, templateName: string, data: any }) {
    try {
        const html = await ejs.renderFile(path.join(__dirname, `../templates/${templateName}.ejs`), data, { async: true })
        const msg = {
            to, 
            from,
            subject,
            html,
          }
          
          const mailSent = await transporter.sendMail(msg)
          // console.log(mailSent);
          
          return mailSent
          
    } catch (error) {
        console.log(error);
        
        throw error
    }
}

export const generateRandom = () => {
    return Math.floor(100000 + Math.random() * 900000)
  }

export const catchError = function (err: { statusCode: number; }, next: (arg0: any) => void) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}

export interface StandardDateTime {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    datestamp: string;
    timestamp: string | null;
    mongoTimestamp: string | null;
  }
  export function getDateTimeForToday(timezone = "Asia/Kolkata"): StandardDateTime {
    // NOTE: Change the timezone instead of America/Chicago to anything
    const today = DateTime.local().setZone(timezone);
  
    return {
      day: today.day,
      month: today.month,
      year: today.year,
      hour: today.hour,
      minute: today.minute,
      datestamp: ((today.year-2000)+''+((today.month<10?'0':'')+today.month)+''+((today.day<10?'0':'')+today.day)+''+((today.hour<10?'0':'')+today.hour)+''+((today.minute<10?'0':'')+today.minute)),
      timestamp: today.toISO({ includeOffset: false }),
      mongoTimestamp: today.toISO({ includeOffset: true })
    }
  }
  
  export function generateFileName(fileExtension: string) {
    // Get current date
    const currentDate = new Date();
  
    // Extract date components
    const year = currentDate.getFullYear() % 100;
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
    // Generate random number (between 1000 and 9999)
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  
    // Construct file name with date stamp and random number
    const fileName = `${year}${month}${day}_${hours}${minutes}${seconds}_${randomNumber}`;
  
    return `${fileName}.${fileExtension}`;
  }
  
  
export async function uploadBase64ImageToS3(base64String: string, sessionId: string) {
    try {
        let base64Image: any = base64String.split(';base64,').pop();
        const fileName = generateFileName("jpeg")
        fs.writeFileSync(fileName, base64Image,{encoding: "base64"});
        const uploadResult = await uploadPromise(fileName, `${sessionId}/${fileName}`)
        console.log('Image uploaded successfully:');
        fs.unlinkSync(fileName);
        return uploadResult
      } catch (error) {
        console.error('Error uploading image to S3:', error);
      }
}

export async function createCollectionWithSchema(collectionName: string, schema: any) {
    const collection = arangoDb.collection(collectionName);
  
    const exists = await collection.exists();
    if (!exists) {
      await arangoDb.createCollection(collectionName, { schema });
      console.log(`Collection ${collectionName} with schema created.`);
    } else {
      await collection.properties({ schema })
    }
  }

  export async function createEdgeCollectionWithSchema(collectionName: string, schema: any) {
    const collection = arangoDb.collection(collectionName);
  
    const exists = await collection.exists();
    if (!exists) {
      await arangoDb.createEdgeCollection(collectionName, { schema });
      console.log(`Collection ${collectionName} with schema created.`);
    } else {
      await collection.properties({ schema })
    }
  }


  export const generateDynamicSkinSummary = (inputAttributes: string[]) => {
    // const inputSet = new Set(inputAttributes.map(attr => attr.toUpperCase()));
    const inputSet = inputAttributes

    const descriptions = [];
    for (const input of inputSet) {
      if(input in aiGeneratedSkinSummary)
        descriptions.push(aiGeneratedSkinSummary[input as keyof typeof aiGeneratedSkinSummary])
    }
    // if (inputSet.includes(attributesEnum.ACNE)) {
    //     descriptions.push('Acne is affecting your skin.');
    // }
    // if (inputSet.includes(attributesEnum.EYE_BAGS)) {
    //     descriptions.push('You are dealing with noticeable eye bags.');
    // }
    // if (inputSet.includes(attributesEnum.DARK_CIRCLES)) {
    //     descriptions.push('Dark circles are present under your eyes.');
    // }
    if (descriptions.length > 0) {
        return `It seems you have the following concerns: ${descriptions.join(' ')}`;
    } else {
        return 'No specific concerns detected.';
    }
}