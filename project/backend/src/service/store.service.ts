import {Storage} from "@google-cloud/storage";
require('dotenv').config();

const env = process.env as any;

const serviceKey = 'keyfile.json'


const bucketName = env.BUCKET_NAME;

const storage = new Storage({
    keyFilename: serviceKey,
});
const bucket = storage.bucket(bucketName);

export class StoreService {

    static uploadFile = (fileBuffer: Buffer, filename: string) => new Promise((resolve => {
        const blob = bucket.file(filename);
        blob.save(fileBuffer, (err) => {
            if (err) {
                resolve(null);
                return;
            }
            const url = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
            resolve(url);
        })
    }));
   static async deleteFile(filename: string) {
        await storage.bucket(bucketName).file(filename).delete();
      
        return;
      }
}