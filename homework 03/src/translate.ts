const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate({
    keyFilename: 'keyfile.json',
});

export class TranslateService{
    static async translateText(text : string, target : string) {
        let [translations] = await translate.translate(text, target);
        translations = Array.isArray(translations) ? translations : [translations];
        return translations;
      }
}