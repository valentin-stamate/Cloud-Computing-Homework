import {Container, CosmosClient, Database} from "@azure/cosmos";
require('dotenv').config();

const env = process.env;

const endpoint = env.DB_ENDPOINT as string;
const key = env.DB_KEY as string;
const databaseId = env.DB_ID;
const containerId = env.DB_CONTAINER_ID;

const client = new CosmosClient({
    endpoint: endpoint,
    key: key
});

let db: Database = {} as Database;
export let recipeContainer: Container = {} as Container;

export async function main() {
    const {database} = await client.databases.createIfNotExists({id: databaseId});
    const {container} = await database.containers.createIfNotExists({id: containerId});

    db = database;
    recipeContainer = container;

    console.log('Successfully connected with Azure Cosmos DB');
}