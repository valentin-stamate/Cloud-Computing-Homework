require('dotenv').config();
const env = process.env;
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;


let subscriptionKey = env.VISION_KEY;
let endpoint = env.VISION_ENDPOINT;

var uriBase = endpoint + 'vision/v3.1/analyze';

const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscriptionKey } }), endpoint);
  

export class VisionService{
    static async tagPicture(imageURL : any) {
       
        const tags = (await computerVisionClient.analyzeImage(imageURL, { visualFeatures: ['Tags'] })).tags;
        const names = [];

        for (let i = 0; i < tags.length; i++) {
            if (!tags[i].hasOwnProperty('name')) {
                continue;
            }

            names.push(tags[i].name);
        }

        return names;
    }
}
