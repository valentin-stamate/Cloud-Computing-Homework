const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
require('dotenv').config()
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
);
  
let containerName = "databaseimages";
let storageAccountName  ="storageaccountcc1234";
const containerClient  = blobServiceClient.getContainerClient(containerName);
export class StoreService{
    static async uploadFileToBlob (file: Buffer | null, filename:string){
        if (!file) return [];
        await containerClient.createIfNotExists({
          access: 'container',
        });
        const blobClient = containerClient.getBlockBlobClient(filename);
  
        await blobClient.uploadData(file);
        const url = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobClient.name}`;
        return url;
      
      };
}
