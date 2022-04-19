import { Recipe } from "./models";
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const env = process.env;

var key = env.TRANSLATE_KEY;
var endpoint = "https://api.cognitive.microsofttranslator.com/";
var apiLocation = "westus3";
export class TranslateService{
    static async translatePost(recipe:Recipe) {
       let trName =await TranslateService.translateText(recipe.name);
       const trDescription = await TranslateService.translateText(recipe.description);
       let newItems = recipe.items;
       for (let i = 0; i < newItems.length; i++) {
            if (!newItems[i].hasOwnProperty('name')) {
                continue;
            }
            newItems[i].name = await TranslateService.translateText(newItems[i].name);
        } 
       const translatedRecipe: Recipe = {
            name: trName,
            description: trDescription,
            items: newItems,
            imageUrl: recipe.imageUrl,
            tags: recipe.tags,
        };
        return translatedRecipe;
    }
    static async translateText(text:string):Promise<string>{
        const response =await axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': apiLocation,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'to': 'en'
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        });
        return response.data[0].translations[0].text
        // axios({
        //     baseURL: endpoint,
        //     url: '/translate',
        //     method: 'post',
        //     headers: {
        //         'Ocp-Apim-Subscription-Key': key,
        //         'Ocp-Apim-Subscription-Region': apiLocation,
        //         'Content-type': 'application/json',
        //         'X-ClientTraceId': uuidv4().toString()
        //     },
        //     params: {
        //         'api-version': '3.0',
        //         'to': 'en'
        //     },
        //     data: [{
        //         'text': text
        //     }],
        //     responseType: 'json'
        // }).then(function (response: { data: any; }) {
        //     //console.log(JSON.stringify(response.data, null, 4));
        //     //console.log(response.data);
        //     //let data = JSON.parse(response.data);
        //     return response.data[0].translations[0].text;
        // });
        // return "";
    }
    
}

