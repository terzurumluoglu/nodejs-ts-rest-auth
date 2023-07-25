import { MongoClient, Db, Collection } from "mongodb";
import { ErrorResponse } from "../utils/ErrorResponse";

let _db: Db;

export const connectDatabase = async () => {
    const databaseName: string = process.env.DB_NAME;
    const username: string = process.env.DB_USERNAME;
    const password: string = process.env.DB_PASSWORD;

    const connectionString: string = process.env.CONNECTION_STRING
        .replace('{{USERNAME}}', username)
        .replace('{{PASSWORD}}', password)
        .replace('{{NAME}}', databaseName);

    const client = new MongoClient(connectionString);

    _db = client.db();

    const connection: MongoClient = await client.connect();

    console.log(`db connection was creaated successfully! Database: ${connection.options.dbName}`);
}

const db = (): Db | ErrorResponse => {
    if (_db) {
        return _db;
    }
    return new ErrorResponse('The Database Not Found', 500);
}

export const getCollection = (collection: string): Collection<Document> => (db() as Db).collection(collection);
