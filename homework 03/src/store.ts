import {Storage} from "@google-cloud/storage";

const serviceKey = 'keyfile.json'


const bucketName = 'cloud_computing_homework1234';

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

}