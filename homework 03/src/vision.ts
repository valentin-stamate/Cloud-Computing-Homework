const vision = require('@google-cloud/vision');


const client = new vision.ImageAnnotatorClient();

export class VisionService{
    static async labelImage(text : string) {
        var path = text.split("/");
        const bucketName = path[3];
        const fileName = path[4];

        const [result] = await client.labelDetection(
            `gs://${bucketName}/${fileName}`
          );
        const labels = result.labelAnnotations;
        let labelResults=[];

        for (let i = 0; i < labels.length; i++) {
            labelResults.push(labels[i].description);
          }  
        return labelResults;
        }
}